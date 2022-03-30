import React, { useState } from "react";
import { Button } from "react-bootstrap";
import cx from "classnames";
import { Link, useNavigate } from "react-router-dom";

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

import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";
import { TABS } from "../myAsset";
import LoanDetailMakeOffer from './makeOffer';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { hideLoadingOverlay, showLoadingOverlay } from 'src/store/loadingOverlay';

const LoanDetailButtons: React.FC<LoanDetailProps> = ({ loan, userOffer }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cancelLoan, cancelOffer, orderNow } = useTransaction();
  const { currentWallet, isConnected } = useCurrentWallet();

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
      toastSuccess(
        <>
          Make offer successfully.{" "}
          {res.txExplorerUrl && (
            <a target="_blank" href={res.txExplorerUrl}>
              View transaction
            </a>
          )}
        </>
      );
      return navigate(`${APP_URL.NFT_LENDING_MY_NFT}?tab=${TABS.offer}`);
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      dispatch(hideLoadingOverlay());
    }
  };

  const onCancelLoan = async (e) => {
    try {
      setSubmitting(true);
      setCanceling(true);
      const res = await cancelLoan({
        nonce: loan.nonce,
        asset_contract_address: loan.asset?.contract_address || '',
        loan_data_address: '' 
      });
      toastSuccess(
        <>
          Cancel loan successfully.{" "}
          {res.txExplorerUrl && (
            <a target="_blank" href={res.txExplorerUrl}>
              View transaction
            </a>
          )}
        </>
      );
      return navigate(`${APP_URL.NFT_LENDING_MY_NFT}`);
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
      const res = await cancelOffer({
        currency_contract_address: loan.currency.contract_address,
        currency_data_address: offer.data_currency_address,
        offer_data_address: offer.data_offer_address,
        nonce: offer.nonce,
      });
      toastSuccess(
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
      <div className={styles.groupOfferButtons}>
        <ButtonConnectWallet className={styles.btnConnect} />
      </div>
    );
  }
  
  if (currentWallet.chain !== loan.chain) {
    return (
      <div className={styles.groupOfferButtons}>
        <div className={styles.differentChain}>
          Your connected wallet is different network from this loan's network ({loan.chain})  
        </div>
      </div>
    );
  }

  if (isOwner)
    return (
      <div className={styles.groupOfferButtons}>
        <Button
          className={cx(styles.btnConnect, styles.btnCancel)}
          variant="danger"
          onClick={onCancelLoan}
          disabled={submitting}
        >
          {canceling ? <Loading dark /> : "Cancel Loan"}
        </Button>
      </div>
    );

  if (userOffer)
    return (
      <div className={styles.groupOfferButtons}>
        <Button
          className={cx(styles.btnConnect, styles.btnCancel)}
          variant="danger"
          onClick={() => onCancelOffer(userOffer)}
          disabled={submitting}
        >
          {canceling ? <Loading dark /> : "Cancel My Offer"}
        </Button>
      </div>
    );

  return (
    <div className={styles.groupOfferButtonWrapper}>
      <div className={styles.groupOfferButtons}>
        <Button
          className={styles.btnConnect}
          disabled={isOwner}
          onClick={onOrderNow}
        >
          Order now
        </Button>
        <Button
          className={styles.btnConnect}
          disabled={isOwner}
          onClick={onMakeOffer}
        >
          Make an offer
        </Button>
      </div>
      <div className={styles.noteTerms}>
        By clicking "Make an offer", you agree to{" "}
        <Link target={"_blank"} to={APP_URL.NFT_LENDING_TERM_OF_SERVICE}>
          Terms of Service
        </Link>
      </div>
    </div>
  );
};

export default LoanDetailButtons;
