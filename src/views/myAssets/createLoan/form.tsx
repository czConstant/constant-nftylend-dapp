import React, {
  FormEventHandler,
  ReactEventHandler,
  useEffect,
  useState,
} from "react";
import { Field, useForm } from "react-final-form";

import Loading from "src/common/components/loading";
import { required } from "src/common/utils/formValidate";
import InputWrapper from "src/common/components/form/inputWrapper";
import FieldAmount from "src/common/components/form/fieldAmount";
import FieldDropdown from "src/common/components/form/fieldDropdown";
import { formatCurrency } from 'src/common/utils/format';
import FieldText from 'src/common/components/form/fieldText';
import { Currency } from 'src/modules/nftLend/models/api';
import { calculateMaxInterest, calculateMaxTotalPay } from 'src/modules/nftLend/utils';
import { LOAN_DURATION } from "src/modules/nftLend/constant";

import styles from "./styles.module.scss";
import { Box, Button, Flex, Grid, GridItem, Switch } from '@chakra-ui/react';
import InfoTooltip from 'src/common/components/infoTooltip';

interface CreateLoanFormProps {
  onSubmit: FormEventHandler;
  onClose: ReactEventHandler;
  listToken: Array<any>;
  defaultTokenMint?: string;
  submitting: boolean;
  values: any;
  isManual: boolean;
}

const CreateLoanForm = (props: CreateLoanFormProps) => {
  const { listToken, defaultTokenMint, onSubmit, values, submitting, isManual } = props;
  const { change } = useForm();

  const [receiveToken, setReceiveToken] = useState<Currency>();

  useEffect(() => {
    change("receiveTokenMint", defaultTokenMint);
    const token = listToken.find(
      (e) => e.contract_address === defaultTokenMint
    );
    if (token) setReceiveToken(token);
  }, [defaultTokenMint]);

  const onChangeReceiveToken = (value: any) => {
    setReceiveToken(value);
  };

  const renderEstimatedInfo = () => {
    if (!values.amount || !values.rate || !values.duration) return null;
    const duration = isNaN(values.duration) ? values.duration.id : values.duration;
    const maxInterest = calculateMaxInterest(
      values.amount,
      values.rate / 100,
      duration,
    );
    const matchingFee = values.amount / 100;
    const totalRepay = calculateMaxTotalPay(
      values.amount,
      values.rate / 100,
      duration,
    );
    return (
      <div className={styles.info}>
        <label>Estimated</label>
        <div>
          Max interest <strong>{formatCurrency(maxInterest, 4)} {receiveToken?.symbol}</strong>
        </div>
        <div>
          <span>Platform fee<InfoTooltip label='This fee is charged by the Pawn Protocol, it’s applied to the borrower when repaying the loans.' /></span>
          <strong>{formatCurrency(matchingFee)} {receiveToken?.symbol}</strong>
        </div>
        <div>
          Max repayment <strong>{formatCurrency(totalRepay)} {receiveToken?.symbol}</strong>
        </div>
      </div>
    )
  };

  return (
    <div className={styles.createLoanForm}>
      <form onSubmit={onSubmit}>
        <Grid gridTemplateColumns='repeat(12, 1fr)'>
        {isManual && (<>
          <GridItem colSpan={9}>
            <InputWrapper label="Contract Address" theme="dark">
              <Field
                name="asset_contract_address"
                placeholder="0x0000000000000000"
                children={FieldText}
                validate={required}
              />
            </InputWrapper>
          </GridItem>
          <GridItem colSpan={9}>
            <InputWrapper label="Token ID" theme="dark">
              <Field
                name="token_id"
                placeholder="0"
                children={FieldText}
                validate={required}
              />
            </InputWrapper>
          </GridItem>
        </>)}
          <GridItem colSpan={9}>
            <InputWrapper label="Receive Token" theme="dark">
              <Field
                name="receiveTokenMint"
                children={FieldDropdown}
                defaultValue={receiveToken?.contract_address}
                list={listToken}
                valueField="contract_address"
                searchable
                alignMenu="right"
                searchFields={["name", "symbol"]}
                handleItemOnChange={onChangeReceiveToken}
                validate={required}
              />
            </InputWrapper>
          </GridItem>
          <GridItem colSpan={3}>
            <Flex alignItems='center' justifyContent='flex-end' gap={4}>
              <Box fontSize='sm' textAlign='right'>Open to<br /> offers</Box>
              <InfoTooltip label="Allow others to offer different variables" iconSize='xl' />
            </Flex>
          </GridItem>
          <GridItem colSpan={9}>
            <InputWrapper label="Receive Amount" theme="dark">
              <Field
                name="amount"
                children={FieldAmount}
                placeholder="0.0"
                appendComp={receiveToken?.symbol}
                validate={required}
              />
            </InputWrapper>
          </GridItem>
          <GridItem colSpan={3} textAlign='right'>
            <Switch colorScheme='brand.primary' mt={4} isChecked={!!values.allow_amount} onChange={e => change('allow_amount', e.target.checked ? 1 : 0)} />
          </GridItem>
          <GridItem colSpan={9}>
            <InputWrapper label="Loan duration" theme="dark">
              <Field
                name="duration"
                placeholder="0"
                appendComp="days"
                children={FieldDropdown}
                defaultValue={LOAN_DURATION[0]}
                list={LOAN_DURATION}
                valueField="id"
                alignMenu="right"
                validate={required}
              />
            </InputWrapper>
          </GridItem>
          <GridItem colSpan={3} textAlign='right'>
            <Switch colorScheme='brand.primary' mt={4} isChecked={!!values.allow_duration} onChange={e => change('allow_duration', e.target.checked ? 1 : 0)} />
          </GridItem>
          <GridItem colSpan={9}>
            <InputWrapper label="Loan interest" theme="dark">
              <Field
                name="rate"
                children={FieldAmount}
                placeholder="0.0"
                appendComp="% APY"
                validate={required}
              />
            </InputWrapper>
          </GridItem>
          <GridItem colSpan={3} textAlign='right'>
            <Switch colorScheme='brand.primary' mt={4} isChecked={!!values.allow_rate} onChange={e => change('allow_rate', e.target.checked ? 1 : 0)} />
          </GridItem>
          <GridItem colSpan={9}>
            <InputWrapper label="Loan available in" theme="dark">
              <Field
                name="available_in"
                children={FieldAmount}
                placeholder="0.0"
                appendComp="days"
                validate={required}
              />
            </InputWrapper>
          </GridItem>
        </Grid>
        {renderEstimatedInfo()}
        <Button mt={4} type="submit" w='100%' disabled={submitting}>
          {submitting ? <Loading dark /> : "Make Loan"}
        </Button>
      </form>
    </div>
  );
};

export default CreateLoanForm;
