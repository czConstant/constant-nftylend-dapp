import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { useDispatch } from "react-redux";
import FieldAmount from "src/common/components/form/fieldAmount";
import InputWrapper from "src/common/components/form/inputWrapper";
import Loading from "src/common/components/loading";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { required } from "src/common/utils/formValidate";
import {
  getAssociatedAccount,
  getLinkSolScanTx,
} from "src/common/utils/solana";
import MakeOfferTransaction from "src/modules/nftLend/transactions/makeOffer";
import styles from "./styles.module.scss";

const CreateOfferForm = ({ onSubmit, loan, submitting }) => {
  return (
    <form onSubmit={onSubmit}>
      <InputWrapper label="Loan Amount" theme="dark">
        <Field
          validate={required}
          name="amount"
          children={FieldAmount}
          placeholder="0.0"
          appendComp={loan.new_loan.currency.symbol}
        />
      </InputWrapper>
      <InputWrapper label="Loan duration" theme="dark">
        <Field
          validate={required}
          name="duration"
          children={FieldAmount}
          placeholder="0"
          appendComp="days"
        />
      </InputWrapper>
      <InputWrapper label="Loan interest" theme="dark">
        <Field
          validate={required}
          name="rate"
          children={FieldAmount}
          placeholder="0.0"
          appendComp="% APY"
        />
      </InputWrapper>
      <Button
        type="submit"
        className={styles.submitButton}
        disabled={submitting}
      >
        {submitting ? <Loading dark={false} /> : "Make Offer"}
      </Button>
    </form>
  );
};

const LoanDetailMakeOffer = ({ wallet, connection, loan, onClose }) => {
  const dispatch = useDispatch();
  const [sendTokenAssociated, setSendTokenAssociated] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const sendTokenMint = loan.new_loan.currency.contract_address;
  const sendTokenSymbol = loan.new_loan.currency.symbol;
  const decimals = loan.new_loan.currency.decimals;

  useEffect(() => {
    getAssociatedAccount(wallet?.publicKey?.toString(), sendTokenMint).then(
      (res) => {
        setSendTokenAssociated(res);
      }
    );
  }, [loan]);

  const onSubmit = async (values: any) => {
    console.log("values", values);

    try {
      setSubmitting(true);
      const transaction = new MakeOfferTransaction(connection, wallet);
      const res = await transaction.run(
        sendTokenMint,
        sendTokenAssociated,
        loan.new_loan.owner,
        loan.new_loan.data_loan_address,
        values.amount * 10 ** decimals,
        values.rate * 100,
        values.duration * 86400
      );

      if (res.txHash) {
        toastSuccess(
          <>
            Cancel loan successfully.{" "}
            <a
              target="_blank"
              href={getLinkSolScanTx(res.txHash)}
              className="blue"
            >
              View transaction
            </a>
          </>
        );
        // dispatch(requestReload());
        onClose();
      }
    } catch (error) {
      toastError(error);
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
          duration: Math.ceil(loan.new_loan.duration / 86400),
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
