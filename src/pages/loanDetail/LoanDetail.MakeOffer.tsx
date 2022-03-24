import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Field, Form, useForm } from "react-final-form";
import FieldAmount from "src/common/components/form/fieldAmount";
import FieldDropdown from "src/common/components/form/fieldDropdown";
import InputWrapper from "src/common/components/form/inputWrapper";
import Loading from "src/common/components/loading";
import { APP_URL } from "src/common/constants/url";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { required } from "src/common/utils/formValidate";
import {
  getAssociatedAccount,
  getLinkSolScanTx,
} from "src/modules/solana/utils";
import { LOAN_DURATION } from "src/modules/nftLend/constant";
import MakeOfferTransaction from "src/modules/solana/transactions/makeOffer";
import { useAppDispatch } from "src/store/hooks";
import { requestReload } from "src/store/nftyLend";
import { TABS } from "../myAsset";
import styles from "./styles.module.scss";

const HIGH_RISK_VALUE = 2.5; // 250%

const validateHighRisk = ({ value, maxValue, message }) => {
  console.log("parseFloat(value)", parseFloat(value));
  console.log(
    "parseFloat(maxValue) * HIGH_RISK_VALUE",
    parseFloat(maxValue) * HIGH_RISK_VALUE
  );

  if (parseFloat(value) > parseFloat(maxValue) * HIGH_RISK_VALUE) {
    return (
      <p className={styles.errorMessage}>
        {message?.replace("%value", HIGH_RISK_VALUE * 100)}
      </p>
    );
  }

  return undefined;
};

const CreateOfferForm = ({ onSubmit, loan, submitting }) => {
  const _form = useForm().getState().values;

  const amountValidate = validateHighRisk({
    value: _form.amount,
    maxValue: loan.new_loan.principal_amount,
    message:
      "Loan Amount offer higher %value% of the original loan order, want review?",
  });

  const interestValidate = validateHighRisk({
    value: _form.rate,
    maxValue: loan.new_loan.interest_rate * 100,
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
          appendComp={loan.new_loan.currency.symbol}
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

const LoanDetailMakeOffer = ({
  wallet,
  connection,
  loan,
  onClose,
  navigate,
}) => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const sendTokenMint = loan.new_loan.currency.contract_address;
  const sendTokenSymbol = loan.new_loan.currency.symbol;
  const decimals = loan.new_loan.currency.decimals;

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      const tokenAssociated = await getAssociatedAccount(
        wallet?.publicKey?.toString(),
        sendTokenMint
      );
      if (!tokenAssociated) return;
      const transaction = new MakeOfferTransaction(connection, wallet);
      const res = await transaction.run(
        sendTokenMint,
        tokenAssociated,
        loan.new_loan.owner,
        loan.new_loan.data_loan_address,
        values.amount * 10 ** decimals,
        values.rate * 100,
        (values.duration?.id || values.duration) * 86400,
        Math.floor(Date.now() / 1000) + 7 * 86400
      );

      if (res?.txHash) {
        toastSuccess(
          <>
            Make offer successfully.{" "}
            <a
              target="_blank"
              href={getLinkSolScanTx(res.txHash)}
              className="blue"
            >
              View transaction
            </a>
          </>
        );
        dispatch(requestReload());
        onClose();
        return navigate(`${APP_URL.NFT_LENDING_MY_NFT}?tab=${TABS.offer}`);
      }
    } catch (error: any) {
      toastError(error?.message || error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.makeOfferFormWrapper}>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          amount: loan.new_loan.principal_amount,
          rate: loan.new_loan.interest_rate * 100,
          duration: LOAN_DURATION.find(
            (v) => v.id === Math.ceil(loan.new_loan.duration / 86400)
          ),
        }}
      >
        {({ handleSubmit }) => (
          <CreateOfferForm
            loan={loan}
            onSubmit={handleSubmit}
            onClose={() => onClose()}
            // defaultTokenMint={receiveToken?.contract_address}
            submitting={submitting}
          />
        )}
      </Form>
    </div>
  );
};

export default LoanDetailMakeOffer;
