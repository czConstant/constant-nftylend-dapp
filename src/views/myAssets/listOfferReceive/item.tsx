import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import BigNumber from "bignumber.js";
import moment from "moment-timezone";
import cx from 'classnames';

import { useAppDispatch } from "src/store/hooks";
import { hideLoadingOverlay, showLoadingOverlay } from "src/store/loadingOverlay";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { requestReload } from "src/store/nftyLend";
import { APP_URL } from "src/common/constants/url";

import listLoanStyled from "../listLoan/styles.module.scss";
import { LOAN_DURATION } from "src/modules/nftLend/constant";
import { useTransaction } from 'src/modules/nftLend/hooks/useTransaction';
import { OfferToLoan } from 'src/modules/nftLend/models/offer';
import BadgeOfferStatus from 'src/views/dashboard/badgeOfferStatus';
import { formatDateTime } from 'src/common/utils/format';

interface ItemProps {
  offer: OfferToLoan;
}

const Item = (props: ItemProps) => {
  const { offer } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { acceptOffer } = useTransaction();

  const [open, setOpen] = useState(false);

  const onAccept = async () => {
    dispatch(showLoadingOverlay());
    try {
      if (!offer.loan || !offer.loan.currency) throw new Error('Offer has no loan currency');
      if (!offer.loan || !offer.loan.asset) throw new Error('Offer has no loan asset');
      const res = await acceptOffer({
        asset_token_id: offer.loan.asset.token_id,
        asset_contract_address: offer.loan.asset.contract_address,
        currency_contract_address: offer.loan.currency.contract_address,
        loan_data_address: offer.loan.data_loan_address,
        offer_data_address: offer.data_offer_address,
        offer_id: offer.id,
        currency_data_address: offer.data_currency_address,
        currency_decimals: offer.loan.currency.decimals,
        principal: offer.principal_amount,
        rate: offer.interest_rate,
        duration: offer.duration,
        borrower: offer.loan.owner,
        borrower_nonce: offer.loan.nonce,
        borrower_signature: offer.loan.signature,
        lender: offer.lender,
        lender_nonce: offer.nonce,
        lender_signature: offer.signature,
      });
      if (res?.completed) {
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
      }
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      dispatch(hideLoadingOverlay());
    }
  };

  const onViewLoan = async () => {
    navigate(`${APP_URL.LIST_LOAN}/${offer.loan?.seo_url}`);
  };

  const showAccept = offer.isListing() && !offer.isExpired();

  const principal = offer.principal_amount;
  const interest = offer.interest_rate;
  const duration = offer.duration;

  const loan = offer.loan;
  const loanDuration = LOAN_DURATION.find(e => e.id === duration / 86400);

  let status = offer.status;
  let badgeVariant = 'success';

  if (
    status === "approved" &&
    moment().isAfter(moment(offer.loan?.approved_offer?.expired_at))
  ) {
    status = "overdue";
  } else if (offer.isExpired()) {
    status = 'expired'
  }

  if (["overdue"].includes(status)) {
    badgeVariant = 'warning';
  } else if (["approved", "repaid", "new"].includes(status)) {
    badgeVariant = 'info';
  } else if (["cancelled", "expired"].includes(status)) {
    badgeVariant = 'info';
  }

  return (
    <div
      key={offer.id}
      onClick={() => setOpen(!open)}
      className={cx(listLoanStyled.item, listLoanStyled.row)}
    >
      <div>
          <a onClick={onViewLoan}>{loan?.asset?.name}</a>
        </div>
        <div>
          {principal} {loan?.currency?.symbol}
        </div>
        <div>
          {loanDuration ? loanDuration.label : `${Math.ceil(new BigNumber(duration).dividedBy(86400).toNumber())} days`}
          &nbsp;/&nbsp;
          {new BigNumber(interest).multipliedBy(100).toNumber()}%
        </div>
        <div><BadgeOfferStatus offer={offer} loan={offer.loan} /></div>
        {/* <div>
          <a target="_blank" href={loan?.getLinkExplorerTx()}>
            {shortCryptoAddress(loan?.init_tx_hash, 8)}
          </a>
        </div> */}
        <div>{formatDateTime(loan?.created_at)}</div>
        <div className={listLoanStyled.actions}>
          {showAccept && <Button onClick={onAccept}>Accept</Button>}
        </div>
    </div>
  );
};

export default Item;
