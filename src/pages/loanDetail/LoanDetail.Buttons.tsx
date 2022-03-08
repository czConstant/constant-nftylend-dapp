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
import { useDispatch } from "react-redux";
import OrderNowTransaction from "src/modules/nftLend/transactions/orderNow";
import { closeModal, openModal } from "src/store/modal";
import LoanDetailMakeOffer from "./LoanDetail.MakeOffer";
import ButtonSolWallet from "src/common/components/buttonSolWallet";

const LoanDetailButtons: React.FC<LoanDetailProps> = ({ loan }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const dispatch = useDispatch();

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
          />
        ),
        title: "Make Offer",
        theme: 'dark'
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
        dispatch(
          toastSuccess({
            message: (
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
            ),
            type: "success",
          })
        );
        // dispatch(requestReload());
      }
    } catch (err) {
      dispatch(toastError({ error: err }));
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
        dispatch(
          toastSuccess({
            message: (
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
            ),
            type: "success",
          })
        );
        // dispatch(requestReload());
      }
    } catch (err) {
      console.log("err0-----", err);
      dispatch(toastError({ error: err }));
    } finally {
      setSubmitting(false);
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
