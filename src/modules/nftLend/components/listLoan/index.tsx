import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';

import { selectNftLend } from 'src/store/nftLend';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import EmptyList from 'src/common/components/emptyList';

import Item from './item';
import { getLoansByOwner } from '../../api';
// import { STATUS } from '../../listLoan/leftSidebar';
import styles from './styles.module.scss';
import Loading from 'src/common/components/loading';

const ListLoan = (props) => {
  const dispatch = useAppDispatch();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const needReload = useAppSelector(selectNftLend).needReload;

  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (publicKey) fetchNFTs();
  }, [publicKey, status, needReload]);

  const fetchNFTs = async () => {
    if (!publicKey) return;
    try {
      setLoading(true);
      const res = await getLoansByOwner(publicKey.toString(), status);
      setLoans(res.result);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) return <EmptyList dark labelText="Connect crypto wallet to view your assets" />;

  return (
    <div className={styles.wrapper}>
      <Dropdown className={styles.dropdown} onSelect={e => e && setStatus(e)}>
        <Dropdown.Toggle><span>{status.toUpperCase() || 'ALL'}</span></Dropdown.Toggle>
        <Dropdown.Menu className={styles.dropdownMenu}>
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          {/* {
            STATUS.map(v => <Dropdown.Item eventKey={v.id} key={v.id}>{v.name}</Dropdown.Item>)
          } */}
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
        {!loading && loans.map((e: any) => <Item key={e.id} loan={e} />)}
      </div>
      {loading && <Loading className={styles.loading} />}
    </div>
  );
};

export default ListLoan;
