import React, { useState } from "react";
import { Button } from "react-bootstrap";
import moment from "moment-timezone";
import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";
import cx from 'classnames';

import { useAppDispatch } from "src/store/hooks";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { requestReload } from "src/store/nftyLend";
import { APP_URL } from "src/common/constants/url";
import { hideLoadingOverlay, showLoadingOverlay } from "src/store/loadingOverlay";
import { closeModal, openModal } from 'src/store/modal';
import ModalConfirmAmount from 'src/modules/nftLend/components/confirmAmountModal';

// import { STATUS } from '../../listLoan/leftSidebar';
import styles from "./styles.module.scss";
import { LOAN_DURATION, LOAN_STATUS } from "../../constant";
import { useTransaction } from '../../hooks/useTransaction';
import { LoanNft } from '../../models/loan';
import { calculateTotalPay } from '../../utils';

interface ItemProps {
  loan: LoanNft;
}

const Item = (props: ItemProps) => {
  const { loan } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cancelLoan, payLoan } = useTransaction();

  const [open, setOpen] = useState(false);

  const onCancelLoan = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!loan.asset) throw new Error('Loan has no asset');
      dispatch(showLoadingOverlay());
      const res = await cancelLoan({
        nonce: loan.nonce,
        asset_token_id: loan.asset.token_id || '',
        asset_contract_address: loan.asset.contract_address || '',
        loan_data_address: '' 
      });
      if (res.completed) toastSuccess(
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
    e.stopPropagation();
    const payAmount = loan?.status === "created"
      ? calculateTotalPay(
        Number(loan.approved_offer?.principal_amount),
        loan.currency.decimals,
        loan.approved_offer?.interest_rate,
        loan.approved_offer?.duration,
        moment(loan.approved_offer?.started_at).unix()
        )
      : 0;
    dispatch(
      openModal({
        id: "confirmAmountModal",
        theme: "dark",
        render: () => (
          <ModalConfirmAmount
            onClose={() => dispatch(closeModal({ id: 'confirmAmountModal' }))}
            onConfirm={() => processPayLoan(amount)}
            asset={loan.asset}
            amount={payAmount}
            symbol={loan.currency?.symbol}
          />
        ),
      })
    );
  };

  const processPayLoan = async (amount: number) => {
    dispatch(showLoadingOverlay());
    try {
      if (!loan.approved_offer) throw new Error('Loan has no approved offer');
      if (!loan.currency) throw new Error('Loan has no currency');
      if (!loan.asset) throw new Error('Loan has no asset');
      const res = await payLoan({
        pay_amount: amount,
        currency_decimal: loan.currency.decimals,
        loan_data_address: loan.data_loan_address,
        offer_data_address: loan.approved_offer?.data_offer_address,
        asset_data_address: loan.data_asset_address,
        asset_token_id: loan.asset.token_id,
        asset_contract_address: loan.asset?.contract_address,
        currency_data_address: loan.approved_offer?.data_currency_address,
        currency_contract_address: loan.currency?.contract_address,
        lender: loan.approved_offer?.lender,
        admin_fee_address: loan.currency?.admin_fee_address,
        principal: loan.approved_offer.principal_amount,
        rate: loan.approved_offer.interest_rate,
        duration: loan.approved_offer.duration,
      });
      if (res.completed) toastSuccess(
        <>
          Pay loan successfully.{" "}
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
  }

  const onViewLoan = async (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`${APP_URL.NFT_LENDING_LIST_LOAN}/${loan?.seo_url}`);
  };

  const showCancel = loan.isListing() || loan.isExpired();
  const showPay = loan.isOngoing() && moment().isBefore(moment(loan.approved_offer?.expired_at));

  const principal = loan.approved_offer
    ? loan.approved_offer.principal_amount
    : loan.principal_amount;
  const interest = loan.approved_offer ? loan.approved_offer.interest_rate : loan.interest_rate;
  const duration = loan.approved_offer ? loan.approved_offer.duration : loan.duration;
  const loanDuration = LOAN_DURATION.find(e => e.id === duration);

  let status = loan.status;
  let statusStyle = {
    backgroundColor: "#00875a33",
    color: "#00875A",
  };

  if (loan.isLiquidated()) {
    status = "liquidated";
  } else if(showPay) {
    status = 'approved';
  } else if (loan.isExpired()) {
    status = 'expired';
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

  return (
    <div key={loan.id} onClick={() => setOpen(!open)} className={cx(styles.item, styles.row)}>
      <div>
        <a onClick={onViewLoan}>{loan.asset?.name}</a>
      </div>
      <div>
        {principal} {loan.currency?.symbol}
      </div>
      <div>
        {loanDuration ? loanDuration.label : `${Math.ceil(new BigNumber(duration).dividedBy(86400).toNumber())} days`}
        &nbsp;/&nbsp;
        {new BigNumber(interest).multipliedBy(100).toNumber()}%
      </div>
      {/* <div>{new BigNumber(interest).multipliedBy(100).toNumber()}%</div> */}
      <div>
        <div className={styles.statusWrap} style={statusStyle}>
          {LOAN_STATUS.find((v) => v.id === status)?.name || "Unknown"}
        </div>
      </div>
      {/* <div>
        <a target="_blank" href={loan.getLinkExplorerTx()}>
          {shortCryptoAddress(loan.init_tx_hash, 8)}
        </a>
      </div> */}
      <div>{moment(loan?.updated_at).format("MM/DD/YYYY HH:mm A")}</div>
      <div className={styles.actions}>
        {showCancel && <Button onClick={onCancelLoan}>Cancel</Button>}
        {showPay && <Button onClick={onPayLoan}>Pay</Button>}
      </div>
    </div>
  );
};

export default Item;
