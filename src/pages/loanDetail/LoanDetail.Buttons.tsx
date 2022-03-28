import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Loading from "src/common/components/loading";
import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";
import cx from "classnames";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { closeModal, openModal } from "src/store/modal";
import ButtonSolWallet from "src/common/components/buttonSolWallet";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { requestReload, selectNftyLend } from "src/store/nftyLend";
import { Link, useNavigate } from "react-router-dom";
import { APP_URL } from "src/common/constants/url";
import { TABS } from "../myAsset";
import LoanDetailMakeOffer from './makeOffer';
import { useTransaction } from 'src/modules/nftLend/hooks/useTransaction';
import { OfferToLoan } from 'src/modules/nftLend/models/offer';
import { Chain } from 'src/common/constants/network';
import { isSameAddress } from 'src/common/utils/helper';

const LoanDetailButtons: React.FC<LoanDetailProps> = ({ loan, userOffer }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cancelLoan, cancelOffer, orderOffer } = useTransaction();
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;

  const [canceling, setCanceling] = useState(false);
  const [orderNow, setOrderNow] = useState(false);
  const [orderPicking, setOrderPicking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = isSameAddress(walletAddress, loan.owner);

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
          dialogClassName: "modal-no-padding",
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
      setSubmitting(true);
      setOrderNow(true);
      if (!loan.currency) throw new Error('Loan has no currency');
      const res = await orderOffer({
        currency_contract_address: loan.currency?.contract_address,
        currency_decimal: loan.currency.decimals,
        loan_owner: loan.owner,
        loan_data_address: loan.data_loan_address,
        lender: walletAddress,
        principal: loan.principal_amount,
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
      setSubmitting(false);
      setOrderNow(false);
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

  if (!walletAddress) {
    return (
      <div className={styles.groupOfferButtons}>
        <ButtonSolWallet className={styles.btnConnect} />
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
          {canceling ? <Loading dark={false} /> : "Cancel Loan"}
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
          {canceling ? <Loading dark={false} /> : "Cancel My Offer"}
        </Button>
      </div>
    );

  return (
    <div className={styles.groupOfferButtonWrapper}>
      <div className={styles.groupOfferButtons}>
        {walletChain === Chain.Solana && (
          <Button
            className={styles.btnConnect}
            disabled={isOwner || orderNow}
            onClick={onOrderNow}
          >
            {orderNow ? <Loading dark={false} /> : "Order now"}
          </Button>
        )}
        <Button
          className={styles.btnConnect}
          disabled={isOwner || orderPicking}
          onClick={onMakeOffer}
        >
          {orderPicking ? <Loading dark={false} /> : "Make an offer"}
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
