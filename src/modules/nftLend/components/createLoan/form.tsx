import {
  FormEventHandler,
  ReactEventHandler,
  useEffect,
  useState,
} from "react";
import { Button } from "react-bootstrap";
import { Field, useForm } from "react-final-form";

import Loading from "src/common/components/loading";
import { required } from "src/common/utils/formValidate";
import InputWrapper from "src/common/components/form/inputWrapper";
import FieldAmount from "src/common/components/form/fieldAmount";
import FieldDropdown from "src/common/components/form/fieldDropdown";
import { formatCurrency } from 'src/common/utils/format';
import MyPopover from 'src/common/components/myPopover';
import FieldText from 'src/common/components/form/fieldText';

import { Currency } from '../../models/api';
import { calculateMaxInterest, calculateMaxTotalPay } from '../../utils';
import { LOAN_DURATION } from "../../constant";
import styles from "./styles.module.scss";

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
    const durationDay = isNaN(values.duration) ? values.duration.id : values.duration;
    const maxInterest = calculateMaxInterest(
      values.amount,
      values.rate / 100,
      durationDay * 86400,
    );
    const matchingFee = values.amount / 100;
    const totalRepay = calculateMaxTotalPay(
      values.amount,
      values.rate / 100,
      durationDay * 86400,
    );
    return (
      <div className={styles.info}>
        <label>Estimated</label>
        <div>
          Max interest <strong>{formatCurrency(maxInterest, 4)} {receiveToken?.symbol}</strong>
        </div>
        <div>
          <span>Platform fee <MyPopover desc="This fee is charged by the Pawn Protocol, it’s applied to the borrower when repaying the loans." /></span>
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
        {isManual && (<>
          <InputWrapper label="Contract Address" theme="dark">
            <Field
              name="asset_contract_address"
              placeholder="0x0000000000000000"
              children={FieldText}
              validate={required}
            />
          </InputWrapper>
          <InputWrapper label="Token ID" theme="dark">
            <Field
              name="token_id"
              placeholder="0"
              children={FieldText}
              validate={required}
            />
          </InputWrapper>
        </>)}
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
        <InputWrapper label="Receive Amount" theme="dark">
          <Field
            name="amount"
            children={FieldAmount}
            placeholder="0.0"
            appendComp={receiveToken?.symbol}
            validate={required}
          />
        </InputWrapper>
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
        <InputWrapper label="Loan interest" theme="dark">
          <Field
            name="rate"
            children={FieldAmount}
            placeholder="0.0"
            appendComp="% APY"
            validate={required}
          />
        </InputWrapper>
        {renderEstimatedInfo()}
        <div className={styles.actions}>
          <Button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? <Loading dark /> : "Make Loan"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateLoanForm;
