import React from "react";
import SectionCollapse from "src/common/components/sectionCollapse";
import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";
import cx from "classnames";
import BigNumber from 'bignumber.js';
import moment from "moment-timezone";
import { Button } from "react-bootstrap";

import {
  formatCurrencyByLocale,
  shortCryptoAddress,
} from "src/common/utils/format";
import { hideLoadingOverlay, showLoadingOverlay } from "src/store/loadingOverlay";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { requestReload } from "src/store/nftyLend";
import { useAppDispatch } from "src/store/hooks";
import { OfferToLoan } from 'src/modules/nftLend/models/offer';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { useTransaction } from 'src/modules/nftLend/hooks/useTransaction';
import { isSameAddress } from 'src/common/utils/helper';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { LOAN_DURATION } from 'src/modules/nftLend/constant';

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

  const isMyOffer = isSameAddress(offer.lender,walletAddress);
  const isMyLoan = isSameAddress(loan.owner, walletAddress);
  const offerDuration = LOAN_DURATION.find(e => e.id === offer.duration / 86400);
  return (
    <div className={cx(styles.tbHeader, styles.tbBody)} key={offer?.id}>
      <div>
        <a
          className={styles.scanLink}
          target="_blank"
          href={offer.getLinkExplorerAddr(offer.lender)}
        >
          {shortCryptoAddress(offer?.lender, 8)}
        </a>
      </div>
      <div>
        {`${formatCurrencyByLocale(offer.principal_amount, 2)} ${loan.currency?.symbol}`}
      </div>
      <div>
        {offerDuration ? offerDuration.label : `${Math.ceil(new BigNumber(offer.duration).dividedBy(86400).toNumber())} days`}
      </div>
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
  const { currentWallet } = useCurrentWallet();
  const { cancelOffer, acceptOffer } = useTransaction();

  const offers = loan.offers || [];

  const onCancel = async (offer: OfferToLoan) => {
    dispatch(showLoadingOverlay());
    try {
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
      if (!loan.asset) throw new Error('Loan has no asset');

      const res = await acceptOffer({
        asset_token_id: loan.asset.token_id,
        asset_contract_address: loan.asset.contract_address,
        currency_contract_address: loan.currency.contract_address,
        loan_data_address: loan.data_loan_address,
        offer_data_address: offer.data_offer_address,
        offer_id: offer.id,
        currency_data_address: offer.data_currency_address,
        currency_decimals: loan.currency.decimals,
        principal: offer.principal_amount,
        rate: offer.interest_rate,
        duration: offer.duration,
        borrower: loan.owner,
        borrower_nonce: loan.nonce,
        borrower_signature: loan.signature,
        lender: offer.lender,
        lender_nonce: offer.nonce,
        lender_signature: offer.signature
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
            walletAddress={currentWallet.address}
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
