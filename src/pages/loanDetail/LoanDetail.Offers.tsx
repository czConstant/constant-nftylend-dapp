import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import SectionCollapse from "src/common/components/sectionCollapse";
import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";
import cx from "classnames";
import {
  getAssociatedAccount,
  getLinkSolScanAccount,
  getLinkSolScanTx,
} from "src/common/utils/solana";
import {
  formatCurrencyByLocale,
  shortCryptoAddress,
} from "src/common/utils/format";
import moment from "moment-timezone";
import { Button } from "react-bootstrap";
import CancelOfferTransaction from "src/modules/nftLend/transactions/cancelOffer";
import {
  hideLoadingOverlay,
  showLoadingOverlay,
} from "src/store/loadingOverlay";
import { toastError, toastSuccess } from "src/common/services/toaster";
import AcceptOfferTransaction from "src/modules/nftLend/transactions/acceptOffer";
import { requestReload } from "src/store/nftLend";
import { useAppDispatch } from "src/store/hooks";

export const OfferTableHeader = () => (
  <div className={styles.tbHeader}>
    <div>Lender</div>
    <div>Principal</div>
    <div>Duration</div>
    <div>Interest rate</div>
    <div>Time</div>
    <div />
  </div>
);

export const OfferTableBody = ({
  offers = [],
  detail,
  wallet,
  onCancel,
  onAccept,
}) =>
  offers.map((offer) => {
    const isMyOffer = offer.lender === wallet?.publicKey?.toString();
    const isMyLoan = detail?.new_loan?.owner === wallet?.publicKey?.toString();
    return (
      <div className={cx(styles.tbHeader, styles.tbBody)} key={offer?.id}>
        <div>
          <a
            className={styles.scanLink}
            target="_blank"
            href={getLinkSolScanAccount(offer?.lender)}
          >
            {shortCryptoAddress(offer?.lender, 8)}
          </a>
        </div>
        <div>
          {`${formatCurrencyByLocale(offer.principal_amount, 2)} ${
            detail?.new_loan?.currency?.symbol
          }`}
        </div>
        <div>{Math.ceil(offer.duration / 86400)} days</div>
        <div>{offer.interest_rate * 100}%</div>
        {/* <div>{offer.principal_amount} {detail?.new_loan?.currency?.symbol}</div> */}
        <div>{moment(offer?.created_at).fromNow()}</div>
        <div className={styles.actions}>
          {isMyOffer && offer?.status === "new" && (
            <Button
              style={{ color: "#dc3545" }}
              variant="link"
              onClick={() => onCancel(offer)}
            >
              Cancel
            </Button>
          )}
          {isMyLoan && offer?.status === "new" && (
            <Button
              style={{ color: "#0d6efd" }}
              variant="link"
              onClick={() => onAccept(offer)}
            >
              Accept
            </Button>
          )}
        </div>
      </div>
    );
  });

const LoanDetailOffers: React.FC<LoanDetailProps> = ({ loan }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const dispatch = useAppDispatch();

  const offers = loan?.new_loan?.offers || [];

  const onCancel = async (offer) => {
    const currencyMint = loan?.new_loan?.currency?.contract_address;
    const currencyAssociated = await getAssociatedAccount(
      wallet.publicKey.toString(),
      currencyMint
    );
    const transaction = new CancelOfferTransaction(connection, wallet);
    try {
      dispatch(showLoadingOverlay());
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
      dispatch(hideLoadingOverlay());
    }
  };

  const onAccept = async (offer) => {
    const currencyMint = loan?.new_loan?.currency?.contract_address;
    const currencyAssociated = await getAssociatedAccount(
      wallet.publicKey.toString(),
      currencyMint
    );
    const principal =
      Number(offer.new_loan.principal_amount) *
      10 ** offer.new_loan.currency.decimals;

    const transaction = new AcceptOfferTransaction(connection, wallet);
    try {
      dispatch(showLoadingOverlay());
      const res = await transaction.run(
        currencyAssociated,
        currencyMint,
        {
          id: offer.new_loan.data_loan_address,
          principal,
          duration: offer.new_loan.duration,
          rate: offer.new_loan.interest_rate * 10000,
        },
        {
          id: offer.data_offer_address,
          token_account_id: offer.data_currency_address,
          lender_usd_associated: offer.lender,
        }
      );
      if (res?.txHash) {
        toastSuccess(
          <>
            Accept offer successfully.{" "}
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
      dispatch(hideLoadingOverlay());
    }
  };

  const renderOfferContent = () => {
    return (
      <>
        <OfferTableHeader />
        <OfferTableBody
          offers={offers}
          detail={loan}
          wallet={wallet}
          onCancel={onCancel}
          onAccept={onAccept}
        />
      </>
    );
  };

  return (
    <SectionCollapse
      label={offers.length === 0 ? "Not yet offer" : "Offers"}
      content={renderOfferContent()}
      selected={offers.length > 0}
      disabled={offers.length === 0}
    />
  );
};

export default LoanDetailOffers;
