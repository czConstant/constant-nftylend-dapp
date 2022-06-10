import { useState, useEffect } from 'react';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';
import { Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { FaCaretDown } from 'react-icons/fa';

import { selectNftyLend } from 'src/store/nftyLend';
import { useAppSelector } from 'src/store/hooks';

import { getOffersByFilter } from 'src/modules/nftLend/api';
import EmptyList from 'src/common/components/emptyList';
import { OFFER_STATUS } from 'src/modules/nftLend/constant';
import { OfferToLoan } from 'src/modules/nftLend/models/offer';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import Item from './item';
import listLoanStyles from '../listLoan/styles.module.scss';

const ListOffer = () => {
  const { currentWallet, isConnected } = useCurrentWallet();
  const needReload = useAppSelector(selectNftyLend).needReload;

  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Array<OfferToLoan>>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isConnected) fetchOffers();
  }, [currentWallet, status, needReload]);

  const fetchOffers = async () => {
    try {
      const res = await getOffersByFilter({ lender: currentWallet.address, status, network: currentWallet.chain });
      setOffers(res.result.map(e => OfferToLoan.parseFromApi(e, currentWallet.chain)));
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <EmptyList dark labelText="Connect crypto wallet to view your assets" />;

  return (
    <div className={cx(isMobile && listLoanStyles.mobileWrap, listLoanStyles.wrapper)}>
      <Menu variant='outline'>
        <MenuButton mt={4} h='40px' minW='120px'>
          <Flex alignItems='center' justifyContent='space-between' pl={4} pr={2}>
            <Text>{status.toUpperCase() || 'ALL'}</Text>
            <Icon fontSize='xl' as={FaCaretDown} />
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setStatus('')}>All</MenuItem>
          {Object.values(OFFER_STATUS).map(v => (
            <MenuItem key={v.id} onClick={() => setStatus(v.id)}>{v.name}</MenuItem>
          ))}
        </MenuList>
      </Menu>
      <div className={listLoanStyles.table}>
        <div className={cx(listLoanStyles.header, listLoanStyles.row)}>
          <div>AssetName</div>
          <div>Amount</div>
          <div>Duration / Interest</div>
          <div>Status</div>
          {/* <div>TxHash</div> */}
          <div>Created At</div>
          <div>Action</div>
        </div>
        {!loading && offers?.length === 0 && <EmptyList dark labelText="There is no offer" />}
        {offers.map((e: any) => <Item key={e.id} offer={e} />)}
      </div>
    </div>
  );
};

export default ListOffer;
