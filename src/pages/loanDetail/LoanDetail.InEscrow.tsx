import React from "react";
import BigNumber from "bignumber.js";
import { ProgressBar } from 'react-bootstrap';
import moment from 'moment-timezone';

import styles from "./styles.module.scss";
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { LOAN_DURATION } from 'src/modules/nftLend/constant';
import { calculateTotalPay } from 'src/modules/nftLend/utils';

export interface LoanDetailProps {
  loan: LoanNft;
}

interface LoanDetailInEscrowProps extends LoanDetailProps {}

const LoanDetailInEscrow: React.FC<LoanDetailInEscrowProps> = ({ loan }) => {
  const { currentWallet } = useCurrentWallet();

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
        {loan.asset?.name} is currently held in escrow in a NFTPawn contract and will be released back to its borrower if a repayment amount of <strong>{payAmount} {loan.currency?.symbol}</strong> is made before {loan.approved_offer.expired_at}
      </div>
    </div>
  );
};

export default LoanDetailInEscrow;
