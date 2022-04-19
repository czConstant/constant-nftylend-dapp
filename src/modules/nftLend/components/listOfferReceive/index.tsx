import { useState, useEffect } from 'react';
import cx from 'classnames';
import { Dropdown } from 'react-bootstrap';

import Item from './item';
import listLoanStyles from '../listLoan/styles.module.scss';
import { selectNftyLend } from 'src/store/nftyLend';
import { getOffersByFilter } from '../../api';
import EmptyList from 'src/common/components/emptyList';
import { OFFER_STATUS } from '../../constant';
import { useAppSelector } from 'src/store/hooks';
import { OfferToLoan } from '../../models/offer';
import { useCurrentWallet } from '../../hooks/useCurrentWallet';
import { isMobile } from 'react-device-detect';

const ListOfferReceive = () => {
  const needReload = useAppSelector(selectNftyLend).needReload;
  const { isConnected, currentWallet } =  useCurrentWallet();

  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Array<OfferToLoan>>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isConnected) fetchOffers();
  }, [currentWallet, status, needReload]);

  const fetchOffers = async () => {
    if (!isConnected) return;
    try {
      const res = await getOffersByFilter({ borrower: currentWallet.address, status });
      setOffers(res.result.map(OfferToLoan.parseFromApi));
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <EmptyList dark labelText="Connect crypto wallet to view your assets" />;

  return (
    <div className={cx(isMobile && listLoanStyles.mobileWrap, listLoanStyles.wrapper)}>
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
          <div>Duration / Interest</div>
          <div>Status</div>
          <div>TxHash</div>
          <div>Created At</div>
          <div>Action</div>
        </div>
        {!loading && offers?.length === 0 && <EmptyList dark labelText="There is no offer" />}
        {offers.map((e: any) => <Item key={e.id} offer={e} />)}
      </div>
    </div>
  );
};

export default ListOfferReceive;
