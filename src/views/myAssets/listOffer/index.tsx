import { useState, useEffect } from 'react';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';
import { Center, Flex, Grid, GridItem, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { FaCaretDown } from 'react-icons/fa';

import { selectNftyLend } from 'src/store/nftyLend';
import { useAppSelector } from 'src/store/hooks';

import { getOffersByFilter } from 'src/modules/nftLend/api';
import EmptyList from 'src/common/components/emptyList';
import { OFFER_STATUS } from 'src/modules/nftLend/constant';
import { OfferToLoan } from 'src/modules/nftLend/models/offer';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import Loading from 'src/common/components/loading';
import Pagination from 'src/common/components/pagination';
import Item from './item';
import listLoanStyles from '../listLoan/styles.module.scss';

const columns = [
  { name: 'Asset Name', flex: 1.5 },
  { name: 'Amount', flex: 1 },
  { name: 'Duration / Interest', flex: 1.5 },
  { name: 'Status', flex: 1 },
  { name: 'Created At', flex: 1 },
  { name: 'Action', flex: 1, align: 'right' },
];

const PAGE_SIZE = 10;

const ListOffer = () => {
  const { currentWallet, isConnected } = useCurrentWallet();
  const needReload = useAppSelector(selectNftyLend).needReload;

  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Array<OfferToLoan>>([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isConnected) return;
    setPage(1);
    fetchOffers(1);
  }, [currentWallet, status, needReload]);

  const fetchOffers = async (page: number) => {
    try {
      const res = await getOffersByFilter({ lender: currentWallet.address, status, network: currentWallet.chain, page, limit: pageSize });
      const list = res.result.map(e => OfferToLoan.parseFromApi(e, currentWallet.chain))
      setOffers(list);
      setTotal(res.count)
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <EmptyList dark labelText="Connect crypto wallet to view your assets" />;
  const templateColumns = columns.reduce((str, e) => str += `${e.flex}fr `, '');

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
      <Flex direction='column' className={listLoanStyles.table}>
        <Grid templateColumns={templateColumns}>
          {columns.map((e, i) => (
            <GridItem
              flex={e.flex}
              alignItems='center'
              textAlign={e.align || 'left'}
              pl={i === 0 ? 8 : 0}
              pr={i === columns.length - 1 ? 8 : 0}
              py={6}
              fontWeight='semibold'
              fontSize='sm'
              textTransform='uppercase'
            >
              {e.name}
            </GridItem>
          ))}
        </Grid>
        {loading && <Center height={20}><Loading /></Center>}
        {!loading && offers?.length === 0 && (
          <EmptyList dark labelText="There is no loan" />
        )}
        {offers.map((e: any) => <Item key={e.id} offer={e} templateColumns={templateColumns} />)}
      </Flex>
      <Flex justifyContent='flex-end'>
        <Pagination
          total={total}
          page={page}
          pageSize={pageSize}
          onChangePage={(p: number) => {
            setPage(p);
            fetchOffers(p);
          }}
        />
      </Flex>
    </div>
  );
};

export default ListOffer;
