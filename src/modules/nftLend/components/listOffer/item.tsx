import { useState } from "react";
import { Button } from "react-bootstrap";
import moment from "moment-timezone";
import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "src/store/hooks";
import {
  hideLoadingOverlay,
  showLoadingOverlay,
} from "src/store/loadingOverlay";
import { requestReload } from "src/store/nftyLend";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { APP_URL } from "src/common/constants/url";

import listLoanStyles from "../listLoan/styles.module.scss";
import { shortCryptoAddress } from "src/common/utils/format";
import { OFFER_STATUS } from "../../constant";
import { useTransaction } from '../../hooks/useTransaction';
import { OfferToLoan } from '../../models/offer';

interface ItemProps {
  offer: OfferToLoan;
}

const Item = (props: ItemProps) => {
  const { offer } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cancelOffer, liquidateLoan, closeOffer } = useTransaction();

  const [open, setOpen] = useState(false);

  const loan = offer.loan;

  const onClaim = async () => {
    try {
      dispatch(showLoadingOverlay());
      if (!offer.loan || !offer.loan.currency) throw new Error('Offer has no loan currency');
      const res = await closeOffer({
        offer_data_address: offer.data_offer_address,
        currency_data_address: offer.data_currency_address,
        currency_contract_address: offer.loan?.currency?.contract_address,
      });
      toastSuccess(
        <>
          Claim asset successfully.{" "}
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

  const onLiquidate = async () => {
    dispatch(showLoadingOverlay());
    try {
      if (!offer.loan || !offer.loan.currency || !offer.loan.asset) throw new Error('Offer has no loan currency');

      const res = await liquidateLoan({
        asset_contract_address: offer.loan.asset.contract_address,
        loan_owner: offer.loan.owner,
        loan_data_address: offer.loan.data_loan_address,
        offer_data_address: offer.data_offer_address,
        asset_data_address: offer.loan.data_asset_address,
        currency_data_address: offer.data_currency_address,
      });
      toastSuccess(
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

  const onCancel = async () => {
    dispatch(showLoadingOverlay());
    if (!offer.loan || !offer.loan.currency) throw new Error('Offer has no loan currency');
    try {
      const res = await cancelOffer({
        currency_contract_address: offer.loan.currency.contract_address,
        currency_data_address: offer.data_currency_address,
        offer_data_address: offer.data_offer_address,
        nonce: offer.nonce,
      });
      if (res?.txHash) {
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
      }
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      dispatch(hideLoadingOverlay());
    }
  };

  const onViewLoan = async () => {
    navigate(`${APP_URL.NFT_LENDING_LIST_LOAN}/${offer?.loan?.seo_url}`);
  };

  const showClaim = offer.status === "repaid";
  const showLiquidate = offer.isApproved() &&
    moment().isAfter(moment(offer.expired_at));
  const showCancel = offer.status === "new";

  const principal = offer.principal_amount;
  const interest = offer.interest_rate;
  const duration = offer.duration;

  let status = offer.status;

  let statusStyle = {
    backgroundColor: "#00875a33",
    color: "#00875A",
  };

  if (showLiquidate) {
    status = "overdue";
  } else if (status === "done" && offer.close_tx_hash) {
    status = "expired";
  } 

  if (["overdue"].includes(status)) {
    statusStyle = {
      backgroundColor: "#e0720b33",
      color: "#DE710B",
    };
  } else if (["cancelled", "expired"].includes(status)) {
    statusStyle = {
      backgroundColor: "#ff000033",
      color: "#ff0000",
    };
  } else if (["repaid", "approved"].includes(status)) {
    statusStyle = {
      backgroundColor: "#0d6dfd33",
      color: "#0d6efd",
    };
  }

  const days = new BigNumber(duration)
    .dividedBy(86400)
    .toPrecision(2, BigNumber.ROUND_CEIL);

  return (
    <div
      key={offer.id}
      onClick={() => setOpen(!open)}
      className={listLoanStyles.item}
    >
      <div className={listLoanStyles.row}>
        <div>
          <a onClick={onViewLoan}>{loan?.asset?.name}</a>
        </div>
        <div>
          {principal} {loan?.currency?.symbol}
        </div>
        <div>
          {days} days / <br />
          {new BigNumber(interest).multipliedBy(100).toNumber()}%
        </div>
        {/* <div>{new BigNumber(interest).multipliedBy(100).toNumber()}%</div> */}
        <div>
          <div className={listLoanStyles.statusWrap} style={statusStyle}>
            {OFFER_STATUS?.[status]?.lender}
          </div>
        </div>
        <div>
          <a target="_blank" href={loan?.getLinkExplorer()}>
            {shortCryptoAddress(loan?.init_tx_hash, 8)}
          </a>
        </div>
        <div>{moment(offer.updated_at).format("MM/DD/YYYY HH:mm A")}</div>
        <div className={listLoanStyles.actions}>
          {showClaim && (
            <Button title="Claim for Credit" onClick={onClaim}>
              Claim (?)
            </Button>
          )}
          {showLiquidate && <Button title="Claim for NFT" onClick={onLiquidate}>Claim (?)</Button>}
          {showCancel && <Button onClick={onCancel}>Cancel</Button>}
        </div>
      </div>
    </div>
  );
};

export default Item;
