import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';

import EmptyList from 'src/components/emptyList';
import Loading from 'src/components/loading';
import withReducer from 'src/hocs/hocWithReducer';

import nftLendingReducer from '../../reducer';
import Item from './item';
import { getLoansByOwner } from '../../action';
import styles from './styles.scss';
import { STATUS } from '../../listLoan/leftSidebar';

const ListLoan = (props) => {
  const dispatch = useDispatch();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const needReload = useSelector(state => state.nftLending.needReload);

  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (publicKey) fetchNFTs();
  }, [publicKey, status, needReload]);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getLoansByOwner(publicKey, status));
      setLoans(res.result);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) return <EmptyList dark labelText="Connect crypto wallet to view your assets" />;

  return (
    <div className={styles.wrapper}>
      <Dropdown className={styles.dropdown} onSelect={e => setStatus(e)}>
        <Dropdown.Toggle><span>{status.toUpperCase() || 'ALL'}</span></Dropdown.Toggle>
        <Dropdown.Menu className={styles.dropdownMenu}>
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          {
            STATUS.map(v => <Dropdown.Item eventKey={v.id} key={v.id}>{v.name}</Dropdown.Item>)
          }
        </Dropdown.Menu>
      </Dropdown>
      <div className={styles.table}>
        <div className={cx(styles.header, styles.row)}>
          <div>AssetName</div>
          <div>Amount</div>
          <div>Duration</div>
          <div>Interest</div>
          <div>Status</div>
          <div>TxHash</div>
          <div>Action</div>
        </div>
        {!loading && loans?.length === 0 && <EmptyList dark labelText="There is no loan" />}
        {!loading && loans.map(e => <Item key={e.id} loan={e} />)}
      </div>
      {loading && <Loading dark={false} className={styles.loading} />}
    </div>
  );
};

export default withReducer('nftLending', nftLendingReducer)(ListLoan);
