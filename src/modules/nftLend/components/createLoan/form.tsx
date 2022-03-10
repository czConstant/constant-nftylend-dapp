import {
  FormEventHandler,
  ReactEventHandler,
  useEffect,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { Field, useForm } from "react-final-form";

import Loading from "src/common/components/loading";

import InputWrapper from "src/common/components/form/inputWrapper";
import FieldAmount from "src/common/components/form/fieldAmount";
import styles from "./styles.module.scss";
import FieldDropdown from "src/common/components/form/fieldDropdown";
import { LOAN_DURATION } from "../../constant";

interface CreateLoanFormProps {
  onSubmit: FormEventHandler;
  onClose: ReactEventHandler;
  listToken: Array<any>;
  defaultTokenMint?: string;
  submitting: boolean;
}

const CreateLoanForm = (props: CreateLoanFormProps) => {
  const { listToken, defaultTokenMint, onSubmit, onClose, submitting } = props;
  const form = useForm();

  const [receiveToken, setReceiveToken] = useState();

  useEffect(() => {
    form.change("receiveTokenMint", defaultTokenMint);
    const token = listToken.find(
      (e) => e.contract_address === defaultTokenMint
    );
    if (token) setReceiveToken(token);
  }, [defaultTokenMint]);

  const onChangeReceiveToken = (value: any) => {
    setReceiveToken(value);
  };

  return (
    <div className={styles.createLoanForm}>
      <form onSubmit={onSubmit}>
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
          />
        </InputWrapper>
        <InputWrapper label="Receive Amount" theme="dark">
          <Field
            name="amount"
            children={FieldAmount}
            placeholder="0.0"
            appendComp={receiveToken?.symbol}
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
          />
        </InputWrapper>
        <InputWrapper label="Loan interest" theme="dark">
          <Field
            name="rate"
            children={FieldAmount}
            placeholder="0.0"
            appendComp="% APY"
          />
        </InputWrapper>
        <div className={styles.actions}>
          <Button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? <Loading dark={false} /> : "Make Loan"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateLoanForm;
