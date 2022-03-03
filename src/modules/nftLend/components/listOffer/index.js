import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { Dropdown } from 'react-bootstrap';

import EmptyList from 'src/components/emptyList';
import withReducer from 'src/hocs/hocWithReducer';

import nftLendingReducer from '../../reducer';
import { getOffersByFilter } from '../../action';
import Item from './item';
import styles from './styles.scss';
import { STATUS } from '../../listLoan/leftSidebar';
import listLoanOffer from '../listLoan/styles.scss';

const ListOffer = (props) => {
  const dispatch = useDispatch();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const needReload = useSelector(state => state.nftLending.needReload);

  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (publicKey) fetchOffers();
  }, [publicKey, status, needReload]);

  const fetchOffers = async () => {
    try {
      const res = await dispatch(getOffersByFilter({ lender: publicKey, status }));
      setOffers(res.result);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) return <EmptyList dark labelText="Connect crypto wallet to view your assets" />;

  return (
    <div className={listLoanOffer.wrapper}>
      <Dropdown className={listLoanOffer.dropdown} onSelect={e => setStatus(e)}>
        <Dropdown.Toggle><span>{status.toUpperCase() || 'ALL'}</span></Dropdown.Toggle>
        <Dropdown.Menu className={listLoanOffer.dropdownMenu}>
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          {
            STATUS.map(v => <Dropdown.Item eventKey={v.id} key={v.id}>{v.name}</Dropdown.Item>)
          }
        </Dropdown.Menu>
      </Dropdown>
      <div className={listLoanOffer.table}>
        <div className={cx(listLoanOffer.header, listLoanOffer.row)}>
          <div>AssetName</div>
          <div>Amount</div>
          <div>Duration</div>
          <div>Interest</div>
          <div>Status</div>
          <div>TxHash</div>
          <div>Action</div>
        </div>
        {!loading && offers?.length === 0 && <EmptyList dark labelText="There is no offer" />}
        {offers.map(e => <Item key={e.id} offer={e} />)}
      </div>
    </div>
  );
};

export default withReducer('nftLending', nftLendingReducer)(ListOffer);
