import React, { useState } from "react";
import { Button } from "react-bootstrap";
import moment from "moment-timezone";
import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "src/store/hooks";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { requestReload } from "src/store/nftyLend";
import { APP_URL } from "src/common/constants/url";
import {
  hideLoadingOverlay,
  showLoadingOverlay,
} from "src/store/loadingOverlay";
import {
  calculateTotalPay,
  getAssociatedAccount,
} from "src/modules/solana/utils";

import PayLoanTransaction from "src/modules/solana/transactions/payLoan";

// import { STATUS } from '../../listLoan/leftSidebar';
import styles from "./styles.module.scss";
import { shortCryptoAddress } from "src/common/utils/format";
import { OFFER_STATUS } from "../../constant";
import { useTransaction } from '../../hooks/useTransaction';
import { LoanNft } from '../../models/loan';

interface ItemProps {
  loan: LoanNft;
}

const Item = (props: ItemProps) => {
  const { loan } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cancelLoan } = useTransaction();

  const [open, setOpen] = useState(false);

  const onCancelLoan = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      dispatch(showLoadingOverlay());
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
      dispatch(requestReload());
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      dispatch(hideLoadingOverlay());
    }
  };

  const onPayLoan = async (e) => {
    // e.stopPropagation();
    // const payAmount =
    //   loan?.status === "created"
    //     ? calculateTotalPay(
    //         Number(loan.offer_principal_amount * 10 ** loan.currency.decimals),
    //         loan.offer_interest_rate * 10 ** 4,
    //         loan.offer_duration,
    //         moment(loan.offer_started_at).unix()
    //       )
    //     : 0;
    // const nftAssociated = await getAssociatedAccount(
    //   wallet.publicKey.toString(),
    //   loan.asset.contract_address
    // );
    // const usdAssociated = await getAssociatedAccount(
    //   wallet.publicKey.toString(),
    //   loan.currency.contract_address
    // );
    // if (!nftAssociated || !usdAssociated) return;
    // const transaction = new PayLoanTransaction(connection, wallet);
    // try {
    //   dispatch(showLoadingOverlay());
    //   const res = await transaction.run(
    //     payAmount,
    //     loan.data_loan_address,
    //     loan.approved_offer.data_offer_address,
    //     nftAssociated,
    //     usdAssociated,
    //     loan.lender,
    //     loan.approved_offer.data_currency_address,
    //     loan.data_asset_address,
    //     loan.currency.admin_fee_address
    //   );
    //   if (res?.txHash) {
    //     toastSuccess(
    //       <>
    //         Pay loan successfully.{" "}
    //         <a target="_blank" href={getLinkSolScanTx(res.txHash)}>
    //           View transaction
    //         </a>
    //       </>
    //     );
    //     dispatch(requestReload());
    //   }
    // } catch (err: any) {
    //   toastError(err?.message || err);
    // } finally {
    //   dispatch(hideLoadingOverlay());
    // }
  };

  const onViewLoan = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("🚀 ~ file: item.tsx ~ line 123 ~ onViewLoan ~ loan", loan)
    navigate(`${APP_URL.NFT_LENDING_LIST_LOAN}/${loan?.seo_url}`);
  };

  const showCancel = loan.status === "new";
  const showPay =
    loan.status === "created" &&
    moment().isBefore(moment(loan.offer_expired_at));
  const showLiquidate =
    loan.status === "created" &&
    moment().isAfter(moment(loan.offer_expired_at));

  const principal = Number(loan.offer_principal_amount)
    ? loan.offer_principal_amount
    : loan.principal_amount;
  const interest = loan.offer_interest_rate || loan.interest_rate;
  const duration = loan.offer_duration || loan.duration;

  let status = loan.status;
  let statusStyle = {
    backgroundColor: "#00875a33",
    color: "#00875A",
  };

  if (showLiquidate) {
    status = "liquidated";
  } else if(showPay) {
    status = 'approved'
  }

  if (["liquidated"].includes(status)) {
    statusStyle = {
      backgroundColor: "#e0720b33",
      color: "#DE710B",
    };
  } else if (["new", "repaid", "created", "approved"].includes(status)) {
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

  console.log("status", status);

  const days = new BigNumber(duration)
    .dividedBy(86400)
    .toPrecision(2, BigNumber.ROUND_CEIL);

  return (
    <div key={loan.id} onClick={() => setOpen(!open)} className={styles.item}>
      <div className={styles.row}>
        <div>
          <a onClick={onViewLoan}>{loan.asset?.name}</a>
        </div>
        <div>
          {principal} {loan.currency?.symbol}
        </div>
        <div>
          {days} days /<br />
          {new BigNumber(interest).multipliedBy(100).toNumber()}%
        </div>
        {/* <div>{new BigNumber(interest).multipliedBy(100).toNumber()}%</div> */}
        <div>
          <div className={styles.statusWrap} style={statusStyle}>
            {OFFER_STATUS?.[status]?.loan}
          </div>
        </div>
        <div>
          <a target="_blank" href={loan.getLinkExplorer()}>
            {shortCryptoAddress(loan.init_tx_hash, 8)}
          </a>
        </div>
        <div>{moment(loan?.created_at).format("MM/DD/YYYY HH:mm A")}</div>
        <div className={styles.actions}>
          {showCancel && <Button onClick={onCancelLoan}>Cancel</Button>}
          {showPay && <Button onClick={onPayLoan}>Pay</Button>}
        </div>
      </div>
    </div>
  );
};

export default Item;
