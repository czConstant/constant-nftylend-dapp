import React from "react";
import BigNumber from "bignumber.js";
import { Button, ProgressBar } from 'react-bootstrap';
import moment from 'moment-timezone';
import cx from 'classnames';
import { useDispatch } from 'react-redux';

import { LoanNft } from 'src/modules/nftLend/models/loan';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { LOAN_DURATION } from 'src/modules/nftLend/constant';
import { calculateTotalPay } from 'src/modules/nftLend/utils';
import { hideLoadingOverlay, showLoadingOverlay } from 'src/store/loadingOverlay';
import { useTransaction } from 'src/modules/nftLend/hooks/useTransaction';
import { toastError, toastSuccess } from 'src/common/services/toaster';
import { requestReload } from 'src/store/nftyLend';
import styles from "./styles.module.scss";

export interface LoanDetailProps {
  loan: LoanNft;
}

interface LoanDetailInEscrowProps extends LoanDetailProps {}

const LoanDetailInEscrow: React.FC<LoanDetailInEscrowProps> = ({ loan }) => {
  const { currentWallet } = useCurrentWallet();
  const dispatch = useDispatch();
  const { payLoan } = useTransaction();

  if (!loan.approved_offer) return null;
  const loanDuration = LOAN_DURATION.find(e => e.id === loan.approved_offer?.duration / 86400);
  const payAmount = calculateTotalPay(
    Number(loan.approved_offer?.principal_amount),
    loan.approved_offer?.interest_rate,
    loan.approved_offer?.duration,
    moment(loan.approved_offer?.started_at).unix()
  );

  const durationDays = Math.ceil(loan.approved_offer?.duration / 86400);
  const loanDays = moment().diff(moment(loan.approved_offer?.started_at), 'd')

  const onPayLoan = async (e) => {
    e.stopPropagation();
    dispatch(showLoadingOverlay());
    try {
      if (!loan.approved_offer) throw new Error('Loan has no approved offer');
      if (!loan.currency) throw new Error('Loan has no currency');
      if (!loan.asset) throw new Error('Loan has no asset');
      const payAmount = loan?.status === "created"
        ? calculateTotalPay(
            Number(loan.approved_offer?.principal_amount),
            loan.approved_offer?.interest_rate,
            loan.approved_offer?.duration,
            moment(loan.approved_offer?.started_at).unix()
          )
        : 0;
      const res = await payLoan({
        pay_amount: payAmount,
        currency_decimal: loan.currency.decimals,
        loan_data_address: loan.data_loan_address,
        offer_data_address: loan.approved_offer?.data_offer_address,
        asset_data_address: loan.data_asset_address,
        asset_contract_address: loan.asset?.contract_address,
        currency_data_address: loan.approved_offer?.data_currency_address,
        currency_contract_address: loan.currency?.contract_address,
        lender: loan.approved_offer?.lender,
        admin_fee_address: loan.currency?.admin_fee_address,
      });
      if (res.completed) toastSuccess(
        <>
          Pay loan successfully.{" "}
          {res.txExplorerUrl && (
            <a target="_blank" href={res.txExplorerUrl}>
              View transaction
            </a>
          )}
        </>
      );
      dispatch(requestReload());
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      dispatch(hideLoadingOverlay());
    }
  };
  
  return (
    <div className={styles.inEscrow}>
      <div className={styles.title}>In Escrow</div>
      <div className={styles.expireProgress}>
        <div>Time until loan expires</div>
        <div className={styles.progress}>
          <ProgressBar now={loanDays * 100 / durationDays} />
          <div>{loanDays}/{loanDuration?.label}</div>
        </div>
      </div>
      <div className={styles.info}>
        <div>
          <label>Repayment Amount</label>
          <div className={styles.value}>{payAmount} {loan.currency?.symbol}</div>
        </div>
        <div>
          <label>APR</label>
          <div className={styles.value}>
            {new BigNumber(loan.approved_offer?.interest_rate)
              .multipliedBy(100)
              .toNumber()}%
          </div>
        </div>
      </div>
      <div className={styles.desc}>
        {loan.asset?.name} is currently held in escrow in a NFTPawn contract and will be released back to its borrower if a repayment amount of <strong>{payAmount} {loan.currency?.symbol}</strong> is made before {moment(loan.approved_offer.expired_at).toLocaleString()}
      </div>
      {currentWallet.address === loan.owner && (
        <div className={styles.groupOfferButtons}>
          <Button
            className={cx(styles.btnConnect)}
            variant="danger"
            onClick={onPayLoan}
          >
            Pay Loan
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoanDetailInEscrow;
