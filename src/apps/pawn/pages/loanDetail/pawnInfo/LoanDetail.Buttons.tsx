import React, { useState } from "react";
import cx from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { Button, Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';

import Loading from "src/common/components/loading";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { closeModal, openModal } from "src/store/modal";
import { useAppDispatch } from "src/store/hooks";
import { requestReload } from "src/store/nftyLend";
import { APP_URL } from "src/common/constants/url";
import { useTransaction } from 'src/modules/nftLend/hooks/useTransaction';
import { OfferToLoan } from 'src/modules/nftLend/models/offer';
import { isSameAddress } from 'src/common/utils/helper';
import ButtonConnectWallet from 'src/common/components/buttonConnectWallet';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { hideLoadingOverlay, showLoadingOverlay } from 'src/store/loadingOverlay';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import DialogConfirmAmount from 'src/apps/pawn/views/app/dialogConfirmAmount';

import LoanDetailMakeOffer from '../makeOffer';
import LoanDetailOffers from './LoanDetail.Offers';
import styles from "../styles.module.scss";
import pawnInfoStyles from "./pawnInfo.module.scss";
import CountdownText from 'src/common/components/countdownText';
import { useToken } from 'src/modules/nftLend/hooks/useToken';
import DialogConfirmCancelLoan from 'src/apps/pawn/views/app/dialogConfirmCancelLoan';

interface LoanDetailButtonsProps {
  loan: LoanNft;
  userOffer: OfferToLoan;
}

const LoanDetailButtons: React.FC<LoanDetailButtonsProps> = ({ loan, userOffer }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cancelLoan, cancelOffer, orderNow } = useTransaction();
  const { currentWallet, isConnected, connectWallet } = useCurrentWallet();
  const { getCurrencyBalance } = useToken()

  const [isShowOffer, setShowOffer] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = isSameAddress(currentWallet.address, loan.owner);

  const onMakeOffer = async () => {
    const close = () =>
      dispatch(
        closeModal({
          id: "createLoanModal",
        })
      );
    dispatch(
      openModal({
        id: "createLoanModal",
        modalProps: {
          centered: true,
          backdrop: "static",
        },
        render: () => (
          <LoanDetailMakeOffer
            loan={loan}
            onClose={close}
            navigate={navigate}
          />
        ),
        title: "Make an Offer",
        theme: "dark",
      })
    );
  };

  const onOrderNow = async () => {
    if (loan.isExpired()) {
      return toastError('This loan has been expired. Please reload and select another one.');
    }

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
          <DialogConfirmAmount
            onClose={() => dispatch(closeModal({ id: 'confirmAmountModal' }))}
            onConfirm={processOrderNow}
            asset={loan.asset}
            amount={loan.principal_amount}
            symbol={loan.currency?.symbol}
          />
        ),
      })
    );
  };

  const processOrderNow = async () => {
    try {
      dispatch(showLoadingOverlay());
      if (!loan.currency) throw new Error('Loan has no currency');
      if (!loan.asset) throw new Error('Loan has no asset');
      const res = await orderNow({
        asset_token_id: loan.asset.token_id,
        asset_contract_address: loan.asset.contract_address,
        loan_data_address: loan.data_loan_address,
        currency_contract_address: loan.currency.contract_address,
        currency_decimals: loan.currency.decimals,
        principal: loan.principal_amount,
        rate: loan.interest_rate,
        duration: loan.duration,
        borrower: loan.owner,
        borrower_nonce: loan.nonce,
        borrower_signature: loan.signature,
      });
      if (res.completed) toastSuccess(
        <>
          Make offer successfully.{" "}
          {res.txExplorerUrl && (
            <a target="_blank" href={res.txExplorerUrl}>
              View transaction
            </a>
          )}
        </>
      );
      return navigate(`${APP_URL.DASHBOARD}/lends`);
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      dispatch(hideLoadingOverlay());
    }
  }

  const onCancelLoan = async () => {
    dispatch(
      openModal({
        id: "confirmCancel",
        theme: "dark",
        title: 'Cancel Loan',
        render: () => (
          <DialogConfirmCancelLoan
            onClose={() => dispatch(closeModal({ id: 'confirmCancel' }))}
            onConfirm={processCancelLoan}
          />
        ),
      })
    );
  }

  const processCancelLoan = async () => {
    try {
      if (!loan.asset) throw new Error('Loan has no asset');
      setSubmitting(true);
      setCanceling(true);
      const res = await cancelLoan({
        nonce: loan.nonce,
        asset_token_id: loan.asset.token_id || '',
        asset_contract_address: loan.asset.contract_address || '',
        loan_data_address: '' 
      });
      if (res.completed) toastSuccess(
        <>
          Cancel loan successfully.{" "}
          {res.txExplorerUrl && (
            <a target="_blank" href={res.txExplorerUrl}>
              View transaction
            </a>
          )}
        </>
      );
      return navigate(`${APP_URL.DASHBOARD}/loans`);
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      setSubmitting(false);
      setCanceling(false);
    }
  };

  const onCancelOffer = async (offer: OfferToLoan) => {
    try {
      setCanceling(true);
      if (!loan.currency) throw new Error('Loan has no currency');
      if (!loan.asset) throw new Error('Loan has no asset');
      const res = await cancelOffer({
        currency_contract_address: loan.currency.contract_address,
        currency_data_address: offer.data_currency_address,
        offer_data_address: offer.data_offer_address,
        offer_id: offer.id,
        asset_token_id: loan.asset.token_id,
        asset_contract_address: loan.asset.contract_address,
        nonce: offer.nonce,
      });
      if (res.completed) toastSuccess(
        <>
          Cancel offer successfully.{" "}
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
      setCanceling(false);
    }
  };
  
  if (!isConnected) {
    return (
      <Flex my={4}>
        <ButtonConnectWallet className={pawnInfoStyles.btnConnect} />
      </Flex>
    );
  }
  
  if (currentWallet.chain !== loan.chain) {
    return (
      <Flex direction='column' className={styles.differentChain}>
        Your connected wallet is different network from this loan's network ({loan.chain})  
        <Button className={styles.btnSwitchChain} onClick={() => connectWallet(loan.chain, currentWallet.name)}>Switch to {loan.chain}</Button>
      </Flex>
    );
  }

  if (isOwner)
    return (
      <Flex gap={4} my={4} w='100%' position='relative'>
        <Button h={50} borderRadius={25} flex={1} variant='outline' colorScheme='brand.danger' onClick={onCancelLoan}disabled={submitting}>
          {canceling ? <Loading dark /> : "Cancel Loan"}
        </Button>
        <Button h={50} borderRadius={25} flex={1} onClick={() => setShowOffer(!isShowOffer)}>
          {isShowOffer ? 'Hide' : 'Show'} Offers ({loan.offers.length})
        </Button>
        <div className={cx(pawnInfoStyles.listOffer, isShowOffer && pawnInfoStyles.show)}>
          <LoanDetailOffers loan={loan} />
        </div>
      </Flex>
    );

  if (userOffer)
    return (
      <Flex my={4}>
        <Button h={50} w='100%' borderRadius={25} variant="outline" colorScheme='brand.danger' onClick={() => onCancelOffer(userOffer)} disabled={submitting}>
          {canceling && <Loading dark />}
          Cancel My Offer ({userOffer.isExpired() ? 'Expired' : <CountdownText hideWhenEnd label='Ends in ' to={userOffer.valid_at} />})
        </Button>
      </Flex>
    );

  if (!loan.isListing() || loan.isExpired()) return null;

  return (
    <Flex direction='column' my={4}>
      <Flex gap={4} w='100%' mb={4}>
        <Button h={50} borderRadius={25} flex={1} disabled={isOwner} onClick={onOrderNow}>
          Order now
        </Button>
        <Button h={50} borderRadius={25} flex={1} variant='outline' colorScheme='brand.primary' disabled={isOwner} onClick={onMakeOffer}>
          Make an offer
        </Button>
      </Flex>
      <div className={styles.noteTerms}>
        <Text fontSize='xs' color='text.secondary'>
          By clicking "Make an offer", you agree to{" "}
          <Link target={"_blank"} to={APP_URL.TERM_OF_SERVICE}>
            Terms of Service
          </Link>
        </Text>
      </div>
    </Flex>
  );
};

export default LoanDetailButtons;
