import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Loading from "src/common/components/loading";
import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";
import cx from "classnames";
import {
  getAssociatedAccount,
  getLinkSolScanTx,
} from "src/common/utils/solana";
import CancelLoanTransaction from "src/modules/nftLend/transactions/cancelLoan";
import { toastError, toastSuccess } from "src/common/services/toaster";
import OrderNowTransaction from "src/modules/nftLend/transactions/orderNow";
import { closeModal, openModal } from "src/store/modal";
import LoanDetailMakeOffer from "./LoanDetail.MakeOffer";
import ButtonSolWallet from "src/common/components/buttonSolWallet";
import { useAppDispatch } from "src/store/hooks";
import { requestReload } from "src/store/nftLend";
import { useNavigate } from "react-router-dom";
import { APP_URL } from "src/common/constants/url";
import CancelOfferTransaction from "src/modules/nftLend/transactions/cancelOffer";
import { TABS } from "../myAsset";

const LoanDetailButtons: React.FC<LoanDetailProps> = ({ loan, userOffer }) => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useWallet();
  const dispatch = useAppDispatch();

  const [canceling, setCanceling] = useState(false);
  const [orderNow, setOrderNow] = useState(false);
  const [orderPicking, setOrderPicking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = wallet?.publicKey?.toString() === loan?.new_loan?.owner;

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
            connection={connection}
            wallet={wallet}
            loan={loan}
            onClose={close}
            navigate={navigate}
          />
        ),
        title: "Make Offer",
        theme: "dark",
      })
    );
  };

  const onOrderNow = async () => {
    const transaction = new OrderNowTransaction(connection, wallet);
    try {
      setSubmitting(true);
      setOrderNow(true);
      const borrowerPubkey = loan.new_loan.owner;
      const tokenMint = loan.new_loan.currency.contract_address;
      const borrowerTokenAssociated = await getAssociatedAccount(
        borrowerPubkey,
        tokenMint
      );
      const lenderTokenAssociated = await getAssociatedAccount(
        wallet.publicKey.toString(),
        tokenMint
      );
      const decimals = loan.new_loan.currency.decimals;
      const res = await transaction.run(
        tokenMint,
        borrowerTokenAssociated,
        borrowerPubkey,
        loan.new_loan.data_loan_address,
        lenderTokenAssociated,
        Number(loan.new_loan.principal_amount) * 10 ** decimals
      );
      if (res.txHash) {
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
        return navigate(`${APP_URL.NFT_LENDING_MY_NFT}?tab=${TABS.offer}`);
      }
    } catch (err) {
      toastError(err?.message);
    } finally {
      setSubmitting(false);
      setOrderNow(false);
    }
  };

  const onCancelLoan = async (e) => {
    const tokenMint = loan.contract_address;
    const nftAssociated = await getAssociatedAccount(
      wallet?.publicKey?.toString(),
      tokenMint
    );
    const transaction = new CancelLoanTransaction(connection, wallet);
    try {
      setSubmitting(true);
      setCanceling(true);
      const res = await transaction.run(
        nftAssociated,
        loan?.new_loan?.data_loan_address,
        loan?.new_loan?.data_asset_address
      );
      if (res?.txHash) {
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
        return navigate(`${APP_URL.NFT_LENDING_MY_NFT}`);
      }
    } catch (err) {
      toastError(err?.message || err);
    } finally {
      setSubmitting(false);
      setCanceling(false);
    }
  };

  const onCancelOffer = async (offer) => {
    const currencyMint = loan?.new_loan?.currency?.contract_address;

    const currencyAssociated = await getAssociatedAccount(
      wallet.publicKey.toString(),
      currencyMint
    );
    const transaction = new CancelOfferTransaction(connection, wallet);
    try {
      setCanceling(true);
      const res = await transaction.run(
        currencyAssociated,
        offer.data_offer_address,
        offer.data_currency_address
      );
      if (res?.txHash) {
        toastSuccess(
          <>
            Cancel offer successfully.{" "}
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
      }
    } catch (err) {
      toastError(err?.message || err);
    } finally {
      setCanceling(false);
    }
  };

  if (!wallet.publicKey) {
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
        <Button
          className={styles.btnConnect}
          disabled={isOwner || orderNow}
          onClick={onOrderNow}
        >
          {orderNow ? <Loading dark={false} /> : "Order now"}
        </Button>
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
        <a href="#">Terms of Service</a>
      </div>
    </div>
  );
};

export default LoanDetailButtons;
