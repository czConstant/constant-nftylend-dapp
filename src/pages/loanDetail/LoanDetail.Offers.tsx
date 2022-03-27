import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import SectionCollapse from "src/common/components/sectionCollapse";
import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";
import cx from "classnames";
import { getLinkSolScanAccount } from "src/modules/solana/utils";
import {
  formatCurrencyByLocale,
  shortCryptoAddress,
} from "src/common/utils/format";
import moment from "moment-timezone";
import { Button } from "react-bootstrap";
import { hideLoadingOverlay, showLoadingOverlay } from "src/store/loadingOverlay";
import { toastError, toastSuccess } from "src/common/services/toaster";
import AcceptOfferTransaction from "src/modules/solana/transactions/acceptOffer";
import { requestReload, selectNftyLend } from "src/store/nftyLend";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { OfferToLoan } from 'src/modules/nftLend/models/offer';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { useTransaction } from 'src/modules/nftLend/hooks/useTransaction';

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

interface OfferRowProps {
  loan: LoanNft,
  offer: OfferToLoan,
  walletAddress: string;
  onCancel: Function,
  onAccept: Function,
}

const OfferRow = (props: OfferRowProps) => {
  const { loan, offer, walletAddress, onCancel, onAccept } = props;
  const isMyOffer = offer.lender === walletAddress;
  const isMyLoan = loan.owner === walletAddress;
  return (
    <div className={cx(styles.tbHeader, styles.tbBody)} key={offer?.id}>
      <div>
        <a
          className={styles.scanLink}
          target="_blank"
          href={offer.getLinkExplorer(offer.lender)}
        >
          {shortCryptoAddress(offer?.lender, 8)}
        </a>
      </div>
      <div>
        {`${formatCurrencyByLocale(offer.principal_amount, 2)} ${loan.currency?.symbol}`}
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
}
  
const LoanDetailOffers: React.FC<LoanDetailProps> = ({ loan }) => {
  const dispatch = useAppDispatch();
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const { cancelOffer, acceptOffer } = useTransaction();

  const offers = loan.offers || [];

  const onCancel = async (offer: OfferToLoan) => {
    dispatch(showLoadingOverlay());
    try {
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
      dispatch(hideLoadingOverlay());
    }
  };

  const onAccept = async (offer: OfferToLoan) => {
    dispatch(showLoadingOverlay());
    try {
      if (!loan.currency) throw new Error('Loan has no currency');
      const res = await acceptOffer({
        currency_contract_address: loan.currency.contract_address,
        loan_data_address: loan.data_loan_address,
        offer_data_address: offer.data_offer_address,
        currency_data_address: offer.data_currency_address,
        currency_decimals: loan.currency.decimals,
        offer_owner: offer.lender,
        principal: offer.principal_amount,
        rate: offer.interest_rate * 10000,
        duration: offer.duration,
      });
      toastSuccess(
        <>
          Accept offer successfully.{" "}
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

  const renderOfferContent = () => {
    return (
      <>
        <OfferTableHeader />
        {offers.map(offer => (
          <OfferRow
            loan={loan}
            offer={offer}
            walletAddress={walletAddress}
            onCancel={onCancel}
            onAccept={onAccept}
          />
        ))}
      </>
    );
  };

  return (
    <SectionCollapse
      id="Offers"
      label={offers.length === 0 ? "Not yet offer" : "Offers"}
      content={renderOfferContent()}
      selected={offers.length > 0}
      disabled={offers.length === 0}
    />
  );
};

export default LoanDetailOffers;
