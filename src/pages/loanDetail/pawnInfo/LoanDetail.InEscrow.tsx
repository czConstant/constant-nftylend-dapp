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
import ModalConfirmAmount from 'src/views/apps/confirmAmountModal';

import styles from "../styles.module.scss";
import { formatCurrency } from 'src/common/utils/format';
import { closeModal, openModal } from 'src/store/modal';

export interface LoanDetailProps {
  loan: LoanNft;
}

interface LoanDetailInEscrowProps extends LoanDetailProps {}

const LoanDetailInEscrow: React.FC<LoanDetailInEscrowProps> = ({ loan }) => {
  const { currentWallet } = useCurrentWallet();
  const dispatch = useDispatch();
  const { payLoan, liquidateLoan } = useTransaction();

  if (!loan.approved_offer) return null;
  const loanDuration = LOAN_DURATION.find(e => e.id === loan.approved_offer?.duration);
  const payAmount = calculateTotalPay(
    Number(loan.approved_offer?.principal_amount),
    Number(loan.currency?.decimals),
    loan.approved_offer?.interest_rate,
    loan.approved_offer?.duration,
    moment(loan.approved_offer?.started_at).unix()
  );

  const durationDays = Math.ceil(loan.approved_offer?.duration / 86400);
  const loanDays = moment().diff(moment(loan.approved_offer?.started_at), 'd')

  const onPayLoan = async (e) => {
    e.stopPropagation();
    const payAmount = loan?.status === "created"
      ? calculateTotalPay(
        Number(loan.approved_offer?.principal_amount),
          Number(loan.currency.decimals),
          loan.approved_offer?.interest_rate,
          loan.approved_offer?.duration,
          moment(loan.approved_offer?.started_at).unix()
        )
      : 0;
    dispatch(
      openModal({
        id: "confirmAmountModal",
        theme: "dark",
        title: 'Confirm Payment',
        render: () => (
          <ModalConfirmAmount
            onClose={() => dispatch(closeModal({ id: 'confirmAmountModal' }))}
            onConfirm={() => processPayLoan(payAmount)}
            asset={loan.asset}
            amount={payAmount}
            symbol={loan.currency?.symbol}
          />
        ),
      })
    );
  };

  const processPayLoan = async (amount: number) => {
    dispatch(showLoadingOverlay());
    try {
      if (!loan.approved_offer) throw new Error('Loan has no approved offer');
      if (!loan.currency) throw new Error('Loan has no currency');
      if (!loan.asset) throw new Error('Loan has no asset');
      
      const res = await payLoan({
        pay_amount: amount,
        currency_decimal: loan.currency.decimals,
        loan_data_address: loan.data_loan_address,
        offer_data_address: loan.approved_offer?.data_offer_address,
        asset_data_address: loan.data_asset_address,
        asset_token_id: loan.asset.token_id,
        asset_contract_address: loan.asset?.contract_address,
        currency_data_address: loan.approved_offer?.data_currency_address,
        currency_contract_address: loan.currency?.contract_address,
        lender: loan.approved_offer?.lender,
        admin_fee_address: loan.currency?.admin_fee_address,
        principal: loan.approved_offer.principal_amount,
        rate: loan.approved_offer.interest_rate,
        duration: loan.approved_offer.duration,
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
  }

  const onLiquidate = async () => {
    dispatch(showLoadingOverlay());
    try {
      if (!loan.currency) throw new Error('Loan has no currency');
      if (!loan.asset) throw new Error('Loan has no asset');
      if (!loan.approved_offer) throw new Error('Loan has no offer');

      const res = await liquidateLoan({
        asset_contract_address: loan.asset.contract_address,
        asset_token_id: loan.asset.token_id,
        loan_owner: loan.owner,
        loan_data_address: loan.data_loan_address,
        offer_data_address: loan.approved_offer.data_offer_address,
        asset_data_address: loan.data_asset_address,
        currency_data_address: loan.approved_offer.data_currency_address,
      });
      if (res.completed) toastSuccess(
        <>
          Liquidate asset successfully.{" "}
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
          <div>{loanDays}/{loanDuration?.label || loan.approved_offer?.duration}</div>
        </div>
      </div>
      <div className={styles.info}>
        <div>
          <label>Repayment Amount</label>
          <div className={styles.value}>{formatCurrency(Number(payAmount), 8)} {loan.currency?.symbol}</div>
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
        {loan.isLiquidated()
          ? <>{loan.asset?.name} is currently held in escrow in an NFTPawn contract and pending your lender to claim.</>
          : <>{loan.asset?.name} is currently held in escrow in a NFTPawn contract and will be released back to its borrower if a repayment amount of <strong>{formatCurrency(Number(payAmount), 8)} {loan.currency?.symbol}</strong> is made before {moment(loan.approved_offer.expired_at).toLocaleString()}.</>
        }
        
      </div>
      {!loan.isLiquidated() && currentWallet.address === loan.owner && (
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
      {loan.isLiquidated() && currentWallet.address === loan.owner && (
        <div className={styles.groupOfferButtons}>
          <Button
            className={cx(styles.btnConnect, styles.btnDisabled)}
            variant="secondary"
            disabled
          >
            Liquidated
          </Button>
        </div>
      )}
      {loan.isLiquidated() && currentWallet.address === loan.approved_offer?.lender && (
        <div className={styles.groupOfferButtons}>
          <Button
            className={cx(styles.btnConnect)}
            variant="danger"
            onClick={onLiquidate}
          >
            Claim NFT
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoanDetailInEscrow;
