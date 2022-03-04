import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import cx from 'classnames';
import { Dropdown } from 'react-bootstrap';

import { selectNftLend } from 'src/store/nftLend';
import { useAppSelector } from 'src/store/hooks';

import Item from './item';
import { getOffersByFilter } from '../../api';
import listLoanStyles from '../listLoan/styles.module.scss';
import EmptyList from 'src/common/components/emptyList';
import { OFFER_STATUS } from '../../constant';

const ListOffer = () => {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const needReload = useAppSelector(selectNftLend).needReload;

  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (publicKey) fetchOffers();
  }, [publicKey, status, needReload]);

  const fetchOffers = async () => {
    if (!publicKey) return;
    try {
      const res = await getOffersByFilter({ lender: publicKey.toString(), status });
      setOffers(res.result);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) return <EmptyList dark labelText="Connect crypto wallet to view your assets" />;

  return (
    <div className={listLoanStyles.wrapper}>
      <Dropdown className={listLoanStyles.dropdown} onSelect={e => e && setStatus(e)}>
        <Dropdown.Toggle><span>{status.toUpperCase() || 'ALL'}</span></Dropdown.Toggle>
        <Dropdown.Menu className={listLoanStyles.dropdownMenu}>
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          {
            Object.values(OFFER_STATUS).map(v => <Dropdown.Item eventKey={v.id} key={v.id}>{v.name}</Dropdown.Item>)
          }
        </Dropdown.Menu>
      </Dropdown>
      <div className={listLoanStyles.table}>
        <div className={cx(listLoanStyles.header, listLoanStyles.row)}>
          <div>AssetName</div>
          <div>Amount</div>
          <div>Duration</div>
          <div>Interest</div>
          <div>Status</div>
          <div>TxHash</div>
          <div>Action</div>
        </div>
        {!loading && offers?.length === 0 && <EmptyList dark labelText="There is no offer" />}
        {offers.map((e: any) => <Item key={e.id} offer={e} />)}
      </div>
    </div>
  );
};

export default ListOffer;
