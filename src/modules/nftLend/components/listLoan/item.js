import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { Button, Collapse } from 'react-bootstrap';
import cx from 'classnames';
import moment from 'moment-timezone';
import BigNumber from 'bignumber.js';

import { URL } from 'src/resources/constants/url';
import { showAlert } from 'src/screens/app/redux/action';
import { showErrorPopup } from 'src/components/errorPopup';
import { shortCryptoAddress } from 'src/utils/common';
import { formatAmountDecimal } from 'src/components/exchangeMethods/loan/utils';
import { hideLoadingOverlay, showLoadingOverlay } from 'src/components/loadingOverlay/redux/api';

import CancelLoanTransaction from '../../transactions/cancelLoan';
import PayLoanTransaction from '../../transactions/payLoan';
import { getAssociatedAccount, getLinkSolScanTx, getLinkSolScanAccount, calculateTotalPay, getLinkSolScanExplorer } from '../../utils';
import { requestReload } from '../../action';
import styles from './styles.scss';
import { STATUS } from '../../listLoan/leftSidebar';

const Item = (props) => {
  const { history, loan } = props;
  const { connection } = useConnection();
  const dispatch = useDispatch();
  const wallet = useWallet();

  const [open, setOpen] = useState(false);

  const onCancelLoan = async (e) => {
    e.stopPropagation();
    const nftMint = loan.asset.contract_address;
    const nftAssociated = await getAssociatedAccount(wallet.publicKey.toString(), nftMint);
    const transaction = new CancelLoanTransaction(connection, wallet);
    try {
      dispatch(showLoadingOverlay());
      const res = await transaction.run(
        nftAssociated,
        loan.data_loan_address,
        loan.data_asset_address,
      );
      if (res?.txHash) {
        dispatch(showAlert({
          message: <>Cancel loan successfully. <a target="_blank" href={getLinkSolScanTx(res.txHash)} className="blue">View transaction</a></>,
          type: 'success'
        }));
        dispatch(requestReload());
      }
    } catch (err) {
      showErrorPopup({ error: err });
    } finally {
      dispatch(hideLoadingOverlay());
    }
  };

  const onPayLoan = async (e) => {
    e.stopPropagation();
    const payAmount = loan?.status === 'created' ? calculateTotalPay(
      Number(loan.offer_principal_amount * 10 ** loan.currency.decimals),
      loan.offer_interest_rate * 10 ** 4,
      loan.offer_duration,
      moment(loan.offer_started_at).unix(),
    ) : 0;
    const nftAssociated = await getAssociatedAccount(wallet.publicKey.toString(), loan.asset.contract_address);
    const usdAssociated = await getAssociatedAccount(wallet.publicKey.toString(), loan.currency.contract_address);
    const transaction = new PayLoanTransaction(connection, wallet);
    try {
      dispatch(showLoadingOverlay());
      const res = await transaction.run(
        payAmount,
        loan.data_loan_address,
        loan.approved_offer.data_offer_address,
        nftAssociated,
        usdAssociated,
        loan.lender,
        loan.approved_offer.data_currency_address,
        loan.data_asset_address,
        loan.currency.admin_fee_address,
      );
      if (res?.txHash) {
        dispatch(showAlert({
          message: <>Pay loan successfully. <a target="_blank" href={getLinkSolScanTx(res.txHash)} className="blue">View transaction</a></>,
          type: 'success'
        }));
        dispatch(requestReload());
      }
    } catch (err) {
      showErrorPopup({ error: err });
    } finally {
      dispatch(hideLoadingOverlay());
    }
  };

  const onViewLoan = async (e) => {
    e.stopPropagation();
    history.push(`${URL.NFT_LENDING_LIST_LOAN}/${loan?.asset?.seo_url}`);
  };

  const showView = loan.status === 'new' || loan.status === 'created';
  const showCancel = loan.status === 'new';
  const showPay = loan.status === 'created' && moment().isBefore(moment(loan.offer_expired_at));

  const principal = loan.offer_principal_amount || loan.principal_amount;
  const interest = loan.offer_interest_rate || loan.interest_rate;
  const duration = loan.offer_duration || loan.duration;

  let statusStyle = {
    backgroundColor: '#00875a33',
    color: '#00875A'
  };

  if (['cancelled', 'liquidated', 'expired'].includes(loan.status)) {
    statusStyle = {
      backgroundColor: '#e0720b33',
      color: '#DE710B'
    };
  }

  return (
    <div key={loan.id} onClick={() => setOpen(!open)} className={styles.item}>
      <div className={styles.row}>
        <div><a onClick={onViewLoan}>{loan.asset.name}</a></div>
        <div>{principal} {loan.currency.symbol}</div>
        <div>{Math.ceil(new BigNumber(duration).dividedBy(86400).toPrecision(2))} days</div>
        <div>{new BigNumber(interest).multipliedBy(100).toNumber()}%</div>
        <div><div className={styles.statusWrap} style={statusStyle}>{STATUS.find(v => v.id === loan.status)?.name}</div></div>
        <div>
          <a target="_blank" href={getLinkSolScanTx(loan.init_tx_hash)}>{shortCryptoAddress(loan.init_tx_hash, 8)}</a>
        </div>
        {/* <div>{loan.asset.name}</div> */}
        {/* <div>{loan.status}</div> */}
        {/* <div>{moment(loan.updated_at).format('YYYY-MM-DD HH:mm')}</div> */}
        <div className={styles.actions}>
          {/* {showView && <Button onClick={onViewLoan}>View</Button>} */}
          {showCancel && <Button onClick={onCancelLoan}>Cancel</Button>}
          {showPay && <Button onClick={onPayLoan}>Pay</Button>}
        </div>
      </div>
      {/* <Collapse in={open}>
        <div>
          <div key={loan.id} className={cx(styles.row, styles.expand)}>
            <div>
              <label>Principal</label>
              <div>{principal} {loan.currency.symbol}</div>
            </div>
            <div>
              <label>Interest</label>
              <div>{interest * 100}%</div>
            </div>
            <div>
              <label>Duration</label>
              <div>{Math.ceil(duration / 86400)} days</div>
            </div>
            {loan.status === 'created' && (
              <div>
                <label>Total</label>
                <div>{formatAmountDecimal(payAmount, 8)} {loan.currency.symbol}</div>
              </div>
            )}
          </div>
        </div>
      </Collapse> */}
    </div>
  );
};

export default withRouter(Item);
