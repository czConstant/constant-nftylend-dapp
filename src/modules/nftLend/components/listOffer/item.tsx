import { useRef, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Button } from "react-bootstrap";
import cx from "classnames";
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
import CloseOfferTransaction from "src/modules/solana/transactions/closeOffer";
import LiquidateLoanTransaction from "src/modules/solana/transactions/liquidateLoan";
import CancelOfferTransaction from "src/modules/solana/transactions/cancelOffer";

import listLoanStyles from "../listLoan/styles.module.scss";
import {
  getAssociatedAccount,
  getLinkSolScanTx,
} from "src/modules/solana/utils";
import { shortCryptoAddress } from "src/common/utils/format";
import { OFFER_STATUS } from "../../constant";

interface ItemProps {
  offer: any;
}

const Item = (props: ItemProps) => {
  const { offer } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useWallet();
  const refRow = useRef();

  const [open, setOpen] = useState(false);

  const onClaim = async () => {
    if (!wallet.publicKey) return;

    const usdtMint = offer.loan.currency.contract_address;
    const usdAssociated = await getAssociatedAccount(
      wallet.publicKey.toString(),
      usdtMint
    );
    if (!usdAssociated) return;

    const transaction = new CloseOfferTransaction(connection, wallet);
    try {
      dispatch(showLoadingOverlay());
      const res = await transaction.run(
        offer.data_offer_address,
        offer.data_currency_address,
        usdAssociated
      );
      if (res?.txHash) {
        toastSuccess(
          <>
            Claim asset successfully.{" "}
            <a target="_blank" href={getLinkSolScanTx(res.txHash)}>
              View transaction
            </a>
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

  const onLiquidate = async () => {
    if (!wallet.publicKey) return;

    const transaction = new LiquidateLoanTransaction(connection, wallet);
    try {
      dispatch(showLoadingOverlay());
      const res = await transaction.run(
        offer.loan.asset.contract_address,
        offer.loan.owner,
        offer.loan.data_loan_address,
        offer.data_offer_address,
        offer.data_currency_address,
        offer.loan.data_asset_address
      );
      if (res?.txHash) {
        toastSuccess(
          <>
            Liquidate asset successfully.{" "}
            <a target="_blank" href={getLinkSolScanTx(res.txHash)}>
              View transaction
            </a>
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

  const onCancel = async () => {
    if (!wallet.publicKey) return;

    const currencyMint = offer?.loan?.currency?.contract_address;
    const currencyAssociated = await getAssociatedAccount(
      wallet.publicKey.toString(),
      currencyMint
    );
    if (!currencyAssociated) return;
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
            Cancel asset successfully.{" "}
            <a target="_blank" href={getLinkSolScanTx(res.txHash)}>
              View transaction
            </a>
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
    navigate(`${APP_URL.NFT_LENDING_LIST_LOAN}/${offer?.loan?.asset?.seo_url}`);
  };

  const showClaim = offer.status === "repaid";
  const showLiquidate =
    offer.status === "approved" &&
    moment().isAfter(moment(offer.loan.offer_expired_at));
  const showCancel = offer.status === "new";

  const principal = offer.offer_principal_amount || offer.principal_amount;
  const interest = offer.offer_interest_rate || offer.interest_rate;
  const duration = offer.offer_duration || offer.duration;

  const loan = offer.loan;
  let status = offer.status;

  let statusStyle = {
    backgroundColor: "#00875a33",
    color: "#00875A",
  };

  if (showLiquidate) {
    status = "overdue";
  } else if (status === "done" && offer?.close_tx_hash) {
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
          <a onClick={onViewLoan}>{loan.asset.name}</a>
        </div>
        <div>
          {principal} {loan.currency.symbol}
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
          <a target="_blank" href={getLinkSolScanTx(loan.init_tx_hash)}>
            {shortCryptoAddress(loan.init_tx_hash, 8)}
          </a>
        </div>
        <div>{moment(loan.created_at).format("MM/DD/YYYY HH:mm A")}</div>
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
