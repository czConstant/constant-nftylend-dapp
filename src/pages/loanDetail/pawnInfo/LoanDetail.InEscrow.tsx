import React from "react";
import BigNumber from "bignumber.js";
import moment from 'moment-timezone';
import { useDispatch } from 'react-redux';
import { Button, Progress, Text } from '@chakra-ui/react';
import { calculateTotalPay } from '@nftpawn-js/core';

import { LoanNft } from 'src/modules/nftLend/models/loan';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { LOAN_DURATION } from 'src/modules/nftLend/constant';
import { hideLoadingOverlay, showLoadingOverlay } from 'src/store/loadingOverlay';
import { useTransaction } from 'src/modules/nftLend/hooks/useTransaction';
import { toastError, toastSuccess } from 'src/common/services/toaster';
import { requestReload } from 'src/store/nftyLend';
import ModalConfirmAmount from 'src/views/apps/confirmAmountModal';

import styles from "../styles.module.scss";
import { formatCurrency } from 'src/common/utils/format';
import { closeModal, openModal } from 'src/store/modal';
import { useToken } from 'src/modules/nftLend/hooks/useToken';

export interface LoanDetailProps {
  loan: LoanNft;
}

interface LoanDetailInEscrowProps extends LoanDetailProps {}

const LoanDetailInEscrow: React.FC<LoanDetailInEscrowProps> = ({ loan }) => {
  const { currentWallet } = useCurrentWallet();
  const dispatch = useDispatch();
  const { payLoan, liquidateLoan } = useTransaction();
  const { getCurrencyBalance } = useToken()

  if (!loan.approved_offer) return null;
  const loanDuration = LOAN_DURATION.find(e => e.id === loan.approved_offer?.duration);
  const payAmount = calculateTotalPay(
    Number(loan.approved_offer?.principal_amount),
    loan.approved_offer?.interest_rate,
    loan.approved_offer?.duration,
    loan.currency?.decimals,
    moment(loan.approved_offer?.started_at).unix()
  );

  const durationDays = Math.ceil(loan.approved_offer?.duration / 86400);
  const loanDays = moment().diff(moment(loan.approved_offer?.started_at), 'd')

  const onPayLoan = async (e) => {
    e.stopPropagation();
    const payAmount = loan?.status === "created"
      ? calculateTotalPay(
          Number(loan.approved_offer?.principal_amount),
          loan.approved_offer?.interest_rate,
          loan.approved_offer?.duration,
          loan.currency?.decimals,
          moment(loan.approved_offer?.started_at).unix()
        )
      : 0;

    const balance = await getCurrencyBalance(loan.currency)
    if (new BigNumber(balance).isLessThan(loan.principal_amount)) {
      return toastError(`Your balance (${balance} ${loan.currency?.symbol}) is not enough`)
    }

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
          <Progress colorScheme='brand.warning' size='lg' borderRadius={16} hasStripe value={loanDays * 100 / durationDays} />
          <div>{loanDays}/{loanDuration?.label || loan.approved_offer?.duration}</div>
        </div>
      </div>
      <div className={styles.info}>
        <div>
        <Text color='text.secondary' fontWeight='medium' fontSize='xs'>Repayment Amount</Text>
          <div className={styles.value}>{formatCurrency(Number(payAmount), 8)} {loan.currency?.symbol}</div>
        </div>
        <div>
          <Text color='text.secondary' fontWeight='medium' fontSize='xs'>APR</Text>
          <div className={styles.value}>
            {new BigNumber(loan.approved_offer?.interest_rate)
              .multipliedBy(100)
              .toNumber()}%
          </div>
        </div>
      </div>
      <Text fontSize='sm'>
        {loan.isLiquidated()
          ? <><strong>{loan.asset?.name}</strong> is currently held in escrow in an NFTPawn contract and pending your lender to claim.</>
          : <><strong>{loan.asset?.name}</strong> is currently held in escrow in a NFTPawn contract and will be released back to its borrower if a repayment amount of <strong>{formatCurrency(Number(payAmount), 8)} {loan.currency?.symbol}</strong> is made before <strong>{moment(loan.approved_offer.expired_at).toLocaleString()}</strong>.</>
        }
        
      </Text>
      {!loan.isLiquidated() && currentWallet.address === loan.owner && (
        <Button w='100%' h={50} mt={4} onClick={onPayLoan}>
          Pay Loan
        </Button>
      )}
      {loan.isLiquidated() && currentWallet.address === loan.owner && (
        <Button w='100%'h={50} mt={4}  colorScheme='whiteAlpha' disabled>
          Liquidated
        </Button>
      )}
      {loan.isLiquidated() && currentWallet.address === loan.approved_offer?.lender && (
        <Button w='100%' h={50} mt={4} onClick={onLiquidate}>
          Claim NFT
        </Button>
      )}
    </div>
  );
};

export default LoanDetailInEscrow;
