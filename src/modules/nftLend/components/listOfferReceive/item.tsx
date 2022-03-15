import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import BigNumber from "bignumber.js";

import { useAppDispatch } from "src/store/hooks";
import {
  getAssociatedAccount,
  getLinkSolScanTx,
} from "src/common/utils/solana";
import {
  hideLoadingOverlay,
  showLoadingOverlay,
} from "src/store/loadingOverlay";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { requestReload } from "src/store/nftLend";
import { APP_URL } from "src/common/constants/url";

import listLoanStyled from "../listLoan/styles.module.scss";
import AcceptOfferTransaction from "../../transactions/acceptOffer";
import { OFFER_STATUS } from "../../constant";
import { shortCryptoAddress } from "src/common/utils/format";
import moment from "moment-timezone";

interface ItemProps {
  offer: any;
}

const Item = (props: ItemProps) => {
  const { offer } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [open, setOpen] = useState(false);

  const onAccept = async () => {
    if (!wallet.publicKey) return;

    const currencyMint = offer.loan.currency?.contract_address;
    const currencyAssociated = await getAssociatedAccount(
      wallet.publicKey.toString(),
      currencyMint
    );
    const principal =
      Number(offer.principal_amount) * 10 ** offer.loan.currency.decimals;
    if (!currencyAssociated) return;

    const transaction = new AcceptOfferTransaction(connection, wallet);
    try {
      dispatch(showLoadingOverlay());
      const res = await transaction.run(
        currencyAssociated,
        currencyMint,
        {
          id: offer.loan.data_loan_address,
          principal,
          duration: offer.duration,
          rate: offer.interest_rate * 10000,
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

  const showAccept = offer.status === "new";

  const principal = offer.offer_principal_amount || offer.principal_amount;
  const interest = offer.offer_interest_rate || offer.interest_rate;
  const duration = offer.offer_duration || offer.duration;

  const loan = offer.loan;

  let status = offer.status;

  let statusStyle = {
    backgroundColor: "#00875a33",
    color: "#00875A",
  };

  if (
    status === "approved" &&
    moment().isAfter(moment(offer.loan.offer_expired_at))
  ) {
    status = "overdue";
  }

  if (["overdue"].includes(status)) {
    statusStyle = {
      backgroundColor: "#e0720b33",
      color: "#DE710B",
    };
  } else if (["approved"].includes(status)) {
    statusStyle = {
      backgroundColor: "#0d6dfd33",
      color: "#0d6efd",
    };
  } else if (["cancelled", "expired"].includes(status)) {
    statusStyle = {
      backgroundColor: "#ff000033",
      color: "#ff0000",
    };
  }

  return (
    <div
      key={offer.id}
      onClick={() => setOpen(!open)}
      className={listLoanStyled.item}
    >
      <div className={listLoanStyled.row}>
        <div>
          <a onClick={onViewLoan}>{loan.asset.name}</a>
        </div>
        <div>
          {principal} {loan.currency.symbol}
        </div>
        <div>
          {Math.ceil(new BigNumber(duration).dividedBy(86400).toNumber())} days
          /<br />
          {new BigNumber(interest).multipliedBy(100).toNumber()}%
        </div>

        <div>
          <div className={listLoanStyled.statusWrap} style={statusStyle}>
            {OFFER_STATUS[status]?.borrower}
          </div>
        </div>
        <div>
          <a target="_blank" href={getLinkSolScanTx(loan.init_tx_hash)}>
            {shortCryptoAddress(loan.init_tx_hash, 8)}
          </a>
        </div>
        <div>{moment(loan.created_at).format("MM/DD/YYYY HH:mm A")}</div>
        <div className={listLoanStyled.actions}>
          {showAccept && <Button onClick={onAccept}>Accept</Button>}
        </div>
      </div>
    </div>
  );
};

export default Item;
