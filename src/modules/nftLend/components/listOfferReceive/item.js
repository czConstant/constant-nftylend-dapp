import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Collapse } from 'react-bootstrap';
import cx from 'classnames';
import moment from 'moment-timezone';

import { URL } from 'src/resources/constants/url';
import { showAlert } from 'src/screens/app/redux/action';
import { showErrorPopup } from 'src/components/errorPopup';
import { shortCryptoAddress } from 'src/utils/common';
import { formatAmountDecimal } from 'src/components/exchangeMethods/loan/utils';
import { hideLoadingOverlay, showLoadingOverlay } from 'src/components/loadingOverlay/redux/api';

import AcceptOfferTransaction from '../../transactions/acceptOffer';
import { getAssociatedAccount, getLinkSolScanTx, getLinkSolScanAccount, calculateTotalPay } from '../../utils';
import { requestReload } from '../../action';
import styles from './styles.scss';
import listLoanOffer from '../listLoan/styles.scss';
import BigNumber from 'bignumber.js';
import { STATUS } from '../../listLoan/leftSidebar';

const Item = (props) => {
  const { history, offer } = props;
  const { connection } = useConnection();
  const dispatch = useDispatch();
  const wallet = useWallet();

  const [open, setOpen] = useState(false);

  const onAccept = async (e) => {
    e.stopPropagation();
    const currencyMint = offer.loan.currency?.contract_address;
    const currencyAssociated = await getAssociatedAccount(wallet.publicKey.toString(), currencyMint);
    const principal = Number(offer.principal_amount) * 10 ** offer.loan.currency.decimals;

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
        dispatch(showAlert({
          message: <>Accept offer successfully. <a target="_blank" href={getLinkSolScanTx(res.txHash)} className="blue">View transaction</a></>,
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
    history.push(`${URL.NFT_LENDING_LIST_LOAN}/${offer?.loan?.asset?.seo_url}`);
  };

  const showView = offer.status === 'new' || offer.status === 'created';
  const showAccept = offer.status === 'new';

  const principal = offer.offer_principal_amount || offer.principal_amount;
  const interest = offer.offer_interest_rate || offer.interest_rate;
  const duration = offer.offer_duration || offer.duration;

  const loan = offer.loan;

  let statusStyle = {
    backgroundColor: '#00875a33',
    color: '#00875A'
  };

  if (['cancelled', 'liquidated', 'expired'].includes(offer.status)) {
    statusStyle = {
      backgroundColor: '#e0720b33',
      color: '#DE710B'
    }
  }


  return (
    <div key={offer.id} onClick={() => setOpen(!open)} className={listLoanOffer.item}>
      <div className={listLoanOffer.row}>
        <div><a onClick={onViewLoan}>{loan.asset.name}</a></div>
        <div>{principal} {loan.currency.symbol}</div>
        <div>{Math.ceil(new BigNumber(duration).dividedBy(86400).toNumber())} days</div>
        <div>{new BigNumber(interest).multipliedBy(100).toNumber()}%</div>
        <div><div className={listLoanOffer.statusWrap} style={statusStyle}>{STATUS.find(v => v.id === offer.status)?.name}</div></div>
        <div>
          <a target="_blank" href={getLinkSolScanTx(loan.init_tx_hash)}>{shortCryptoAddress(loan.init_tx_hash, 8)}</a>
        </div>
        <div className={listLoanOffer.actions}>
          {showAccept && <Button onClick={onAccept}>Accept</Button>}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Item);
