import { Button } from "react-bootstrap";
import { Field, useForm } from "react-final-form";
import FieldAmount from "src/common/components/form/fieldAmount";
import FieldDropdown from "src/common/components/form/fieldDropdown";
import InputWrapper from "src/common/components/form/inputWrapper";
import Loading from "src/common/components/loading";
import { required } from "src/common/utils/formValidate";
import { LOAN_DURATION } from "src/modules/nftLend/constant";
import { LoanNft } from 'src/modules/nftLend/models/loan';
import styles from "../styles.module.scss";

const HIGH_RISK_VALUE = 2.5; // 250%

const validateHighRisk = ({ value, maxValue, message }) => {
  if (parseFloat(value) > parseFloat(maxValue) * HIGH_RISK_VALUE) {
    return (
      <p className={styles.errorMessage}>
        {message?.replace("%value", HIGH_RISK_VALUE * 100)}
      </p>
    );
  }

  return undefined;
};

interface MakeOfferFormProps {
  loan: LoanNft;
  onSubmit: Function;
  submitting: boolean;
};

const MakeOfferForm = (props: MakeOfferFormProps) => {
  const { onSubmit, loan, submitting } = props;
  const _form = useForm().getState().values;

  const amountValidate = validateHighRisk({
    value: _form.amount,
    maxValue: loan.principal_amount,
    message:
      "Loan Amount offer higher %value% of the original loan order, want review?",
  });

  const interestValidate = validateHighRisk({
    value: _form.rate,
    maxValue: loan.interest_rate * 100,
    message:
      "Loan Interest %APY offer higher 250% of the original loan order, want review? ",
  });

  return (
    <form onSubmit={onSubmit}>
      <InputWrapper label="Loan Amount" theme="dark">
        <Field
          validate={required}
          name="amount"
          children={FieldAmount}
          placeholder="0.0"
          appendComp={loan.currency?.symbol}
          errorMessage={amountValidate}
        />
      </InputWrapper>
      <InputWrapper label="Loan duration" theme="dark">
        <Field
          name="duration"
          placeholder="0"
          appendComp="days"
          children={FieldDropdown}
          list={LOAN_DURATION}
          valueField="id"
          alignMenu="right"
          validate={required}
        />
      </InputWrapper>
      <InputWrapper label="Loan interest" theme="dark">
        <Field
          validate={required}
          name="rate"
          children={FieldAmount}
          placeholder="0.0"
          appendComp="% APY"
          errorMessage={interestValidate}
        />
      </InputWrapper>
      {amountValidate}
      {interestValidate}
      <Button
        type="submit"
        className={styles.submitButton}
        disabled={submitting}
      >
        {submitting ? <Loading dark={false} /> : "Offer now"}
      </Button>
    </form>
  );
};

export default MakeOfferForm;