import React, {
  FormEventHandler,
  ReactEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Field, useForm } from "react-final-form";
import { Box, Button, Checkbox, Flex, Grid, GridItem, Switch, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import moment from 'moment-timezone';

import Loading from "src/common/components/loading";
import { composeValidators, maxValue, required } from "src/common/utils/formValidate";
import InputWrapper from "src/common/components/form/inputWrapper";
import FieldAmount from "src/common/components/form/fieldAmount";
import FieldDropdown from "src/common/components/form/fieldDropdown";
import { formatCurrency, formatDateTime } from 'src/common/utils/format';
import FieldText from 'src/common/components/form/fieldText';
import { Currency } from 'src/modules/nftLend/models/api';
import { calculateMaxInterest, calculateMaxTotalPay } from 'src/modules/nftLend/utils';
import { LOAN_DURATION } from "src/modules/nftLend/constant";
import InfoTooltip from 'src/common/components/infoTooltip';
import { AssetNft } from 'src/modules/nftLend/models/nft';

import styles from "./styles.module.scss";

interface CreateLoanFormProps {
  onSubmit: FormEventHandler
  onClose: ReactEventHandler
  listToken: Array<any>
  defaultTokenMint?: string
  submitting: boolean
  values: any
  isManual: boolean
  asset?: AssetNft
}

const CreateLoanForm = (props: CreateLoanFormProps) => {
  const { listToken, defaultTokenMint, onSubmit, values, submitting, isManual, asset } = props
  const { change, getState } = useForm()

  const [receiveToken, setReceiveToken] = useState<Currency>()
  const [maxAmount, setMaxAmount] = useState(0)
  const [isAgree, setIsAgree] = useState(false)

  useEffect(() => {
    change("receiveTokenMint", defaultTokenMint);
    const token = listToken.find(
      (e) => e.contract_address === defaultTokenMint
    );
    if (token) setReceiveToken(token);
  }, [defaultTokenMint]);

  useEffect(() => {
    if (!receiveToken || !asset) return
    const max = new BigNumber(asset?.stats?.avg_price || asset?.stats?.floor_price)
      .multipliedBy(asset?.stats?.currency?.price)
      .multipliedBy(1.5)
      .dividedBy(receiveToken?.price)
      .toNumber()
    setMaxAmount(max || 0)
  }, [receiveToken, asset])

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
    const matchingFee = new BigNumber(values.amount).dividedBy(100).toNumber();
    const totalRepay = calculateMaxTotalPay(
      values.amount,
      values.rate / 100,
      duration,
    );
    return (<>
      <div className={styles.info}>
        <label>Estimated</label>
        <div>
          Max interest <strong>{formatCurrency(maxInterest, 4)} {receiveToken?.symbol}</strong>
        </div>
        <div>
          <Flex><Text mr={2}>Platform fee</Text><InfoTooltip label='This fee is charged by the Pawn Protocol, it’s applied to the borrower when repaying the loans.' /></Flex>
          <strong>{formatCurrency(matchingFee)} {receiveToken?.symbol}</strong>
        </div>
        <div>
          Max repayment <strong>{formatCurrency(totalRepay)} {receiveToken?.symbol}</strong>
        </div>
      </div>
      <Checkbox mt={4} wordBreak='break-word' onChange={e => setIsAgree(e.target.checked)}>
        <Text fontSize='xs' maxW='100%'>
          I understand that if I do not repay
          &nbsp;<Text as='strong' color='brand.warning.400'>{formatCurrency(totalRepay)} {receiveToken?.symbol}</Text>
          &nbsp;before 
          &nbsp;<Text as='strong' color='brand.warning.400'>{formatDateTime(moment().add(duration, 's').add(2, 'd').toDate())}</Text>
          &nbsp;from the time the loan is funded, I will lose ownership of the NFT.
        </Text>
      </Checkbox>
    </>)
  };

  const amountNote = useMemo(() => asset?.stats?.avg_price
    ? `The NFT's AVG Price is ${asset?.stats?.avg_price}, you should consider an amount smaller than ${maxAmount} (150%)`
    : `The NFT Collection Floor price is ${asset?.stats?.floor_price || 0}, you should consider an amount smaller than ${maxAmount} (150%)`
  , [maxAmount, asset])

  return (
    <Box w='450px' className={styles.createLoanForm}>
      <form onSubmit={onSubmit}>
        <Grid gridTemplateColumns='repeat(12, 1fr)'>
        {isManual && (<>
          <GridItem colSpan={9}>
            <InputWrapper label="Contract Address">
              <Field
                name="asset_contract_address"
                placeholder="0x0000000000000000"
                children={FieldText}
                validate={required}
              />
            </InputWrapper>
          </GridItem>
          <GridItem colSpan={9}>
            <InputWrapper label="Token ID">
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
            <InputWrapper label="Receive Token">
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
            <Text color='brand.warning.400' mb={4} fontSize='xs'>{amountNote}</Text>
            <InputWrapper label="Receive Amount">
              <Field
                name="amount"
                children={FieldAmount}
                placeholder="0.0"
                appendComp={receiveToken?.symbol}
                validate={composeValidators(required, maxValue(maxAmount || Number.MAX_SAFE_INTEGER, `The amount can not be bigger than 150% NFT's AVG Price / NFT Collection Floor Price, please consider another amount lower than that`))}
              />
            </InputWrapper>
          </GridItem>
          <GridItem colSpan={3} textAlign='right'>
            <Switch colorScheme='brand.primary' mt={4} isChecked={!!values.allow_amount} onChange={e => change('allow_amount', e.target.checked ? 1 : 0)} />
          </GridItem>
          <GridItem colSpan={9}>
            <InputWrapper label="Loan duration">
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
            <InputWrapper label="Loan interest">
              <Field
                name="rate"
                children={FieldAmount}
                placeholder="0.0"
                appendComp="% APR"
                validate={required}
              />
            </InputWrapper>
          </GridItem>
          <GridItem colSpan={3} textAlign='right'>
            <Switch colorScheme='brand.primary' mt={4} isChecked={!!values.allow_rate} onChange={e => change('allow_rate', e.target.checked ? 1 : 0)} />
          </GridItem>
          <GridItem colSpan={9}>
            <InputWrapper label="Loan available in">
              <Field
                name="available_in"
                children={FieldAmount}
                placeholder="0.0"
                appendComp="days"
                decimals={0}
                validate={required}
              />
            </InputWrapper>
          </GridItem>
        </Grid>
        {renderEstimatedInfo()}
        <Button h={50} mt={4} type="submit" w='100%' disabled={!isAgree || submitting}>
          {submitting ? <Loading dark /> : "Make Loan"}
        </Button>
      </form>
    </Box>
  );
};

export default CreateLoanForm;
