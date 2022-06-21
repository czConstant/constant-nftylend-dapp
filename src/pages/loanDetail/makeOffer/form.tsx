import React, { useEffect, useState } from 'react';
import { calculateMaxInterest, calculateMaxTotalPay } from '@nftpawn-js/core';
import { Field, useForm, useFormState } from "react-final-form";
import { Button, Flex, Spinner, Text } from '@chakra-ui/react';

import FieldAmount from "src/common/components/form/fieldAmount";
import FieldDropdown from "src/common/components/form/fieldDropdown";
import InputWrapper from "src/common/components/form/inputWrapper";
import Loading from "src/common/components/loading";
import { composeValidators, maxValue, required } from "src/common/utils/formValidate";
import { LOAN_DURATION } from "src/modules/nftLend/constant";
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { formatCurrency } from 'src/common/utils/format';
import InfoTooltip from 'src/common/components/infoTooltip';
import styles from "./makeOfferForm.module.scss";
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import BigNumber from 'bignumber.js';
import { useToken } from 'src/modules/nftLend/hooks/useToken';

const HIGH_RISK_VALUE = 2.5; // 250%

const validateHighRisk = ({ value, maxValue, message }) => {
  if (parseFloat(value) > parseFloat(maxValue) * HIGH_RISK_VALUE) {
    return (
      <div className={styles.errorMessage}>
        {message?.replace("%value", HIGH_RISK_VALUE * 100)}
      </div>
    );
  }

  return undefined;
};

interface MakeOfferFormProps {
  loan: LoanNft;
  onSubmit: React.FormEventHandler;
  submitting: boolean;
  values: any;
};

const MakeOfferForm = (props: MakeOfferFormProps) => {
  const { onSubmit, loan, submitting } = props;
  const { currentWallet } = useCurrentWallet()
  const { getBalance } = useToken()
  const { values } = useFormState()
  const { resetFieldState } = useForm()

  const [warnings, setWarnings] = useState({ amount: '', rate: '' })
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBalance()
  }, [loan])

  useEffect(() => {
    const amountValidate = validateHighRisk({
      value: values.amount,
      maxValue: loan.principal_amount,
      message:
        "Loan Amount offer higher %value% of the original loan order, want review?",
    });
  
    const interestValidate = validateHighRisk({
      value: values.rate,
      maxValue: loan.interest_rate * 100,
      message:
        "Loan Interest %APY offer higher 250% of the original loan order, want review? ",
    });

    setWarnings({ amount: amountValidate, rate: interestValidate });
  }, [values])

  useEffect(() => {
    resetFieldState('amount')
  }, [balance])

  const fetchBalance = async() => {
    if (!loan.currency) return
    try {
      setLoading(true)
      const res = await getBalance(loan.currency.contract_address)
      setBalance(new BigNumber(res).dividedBy(10 ** loan.currency?.decimals).toNumber());
    } finally {
      setLoading(false)
    }
  }

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
          Max interest <strong>{formatCurrency(maxInterest, 4)} {loan.currency?.symbol}</strong>
        </div>
        <div>
          <Flex><Text mr={2}>Platform fee</Text><InfoTooltip label="This fee is charged by the Pawn Protocol, it’s applied to the borrower when repaying the loans." /></Flex>
          <strong>{formatCurrency(matchingFee)} {loan.currency?.symbol}</strong>
        </div>
        <div>
          Max repayment <strong>{formatCurrency(totalRepay)} {loan.currency?.symbol}</strong>
        </div>
      </div>
    )
  };

  return (
    <form onSubmit={onSubmit}>
      <InputWrapper label="Loan Amount" theme="dark">
        <Field
          disabled={!loan.isAllowChange('principal_amount')}
          validate={composeValidators(required, maxValue(balance, `Your balance is not enough`))}
          name="amount"
          children={FieldAmount}
          placeholder="0.0"
          appendComp={loan.currency?.symbol}
        />
        {!loan.isAllowChange('principal_amount') &&<div className={styles.errorMessage}>Borrower do not willing to receive offer with changes in this term</div>}
        <Flex fontSize='xs' mt={2}>
          <Text mr={2}>Balance:</Text>
          {loading ? <Spinner size='xs' /> : <Text fontWeight='medium'>{formatCurrency(balance)}</Text>}
        </Flex>
        <div className={styles.errorMessage}>{warnings.amount}</div>
      </InputWrapper>
      <InputWrapper label="Loan duration" theme="dark">
        <Field
          disabled={!loan.isAllowChange('duration')}
          name="duration"
          placeholder="0"
          appendComp="days"
          children={FieldDropdown}
          list={LOAN_DURATION}
          valueField="id"
          alignMenu="right"
          validate={required}
        />
        {!loan.isAllowChange('duration') &&<div className={styles.errorMessage}>Borrower do not willing to receive offer with changes in this term</div>}
      </InputWrapper>
      <InputWrapper label="Loan interest" theme="dark">
        <Field
          disabled={!loan.isAllowChange('interest_rate')}
          validate={required}
          name="rate"
          children={FieldAmount}
          placeholder="0.0"
          appendComp="% APY"
        />
        {!loan.isAllowChange('interest_rate') &&<div className={styles.errorMessage}>Borrower do not willing to receive offer with changes in this term</div>}
        <div className={styles.errorMessage}>{warnings.rate}</div>
      </InputWrapper>
      <InputWrapper label="Offer available in" theme="dark">
        <Field
          validate={required}
          name="available_in"
          children={FieldAmount}
          placeholder="0.0"
          appendComp="days"
          decimals={0}
        />
      </InputWrapper>
      {renderEstimatedInfo()}
      <Button type="submit" w='100%' mt={4} disabled={submitting}>
        {submitting ? <Loading dark /> : "Offer now"}
      </Button>
    </form>
  );
};

export default MakeOfferForm;