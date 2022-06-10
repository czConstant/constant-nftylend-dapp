import { useState, useEffect } from "react";
import cx from "classnames";
import { isMobile } from "react-device-detect";
import { Flex, Grid, GridItem, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { FaCaretDown } from 'react-icons/fa';

import { selectNftyLend } from "src/store/nftyLend";
import { useAppSelector } from "src/store/hooks";
import EmptyList from "src/common/components/emptyList";
import Loading from "src/common/components/loading";
import { getLoansByOwner } from "src/modules/nftLend/api";
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { LOAN_STATUS } from 'src/modules/nftLend/constant';

import Item from "./item";
import styles from "./styles.module.scss";
import Pagination from 'src/common/components/pagination';

const columns = [
  { name: 'Asset Name', flex: 1.5 },
  { name: 'Amount', flex: 1 },
  { name: 'Duration / Interest', flex: 1.5 },
  { name: 'Status', flex: 1 },
  { name: 'Created At', flex: 1 },
  { name: 'Action', flex: 1, align: 'right' },
];

const PAGE_SIZE = 10;

const ListLoan = () => {
  const needReload = useAppSelector(selectNftyLend).needReload;
  const { currentWallet, isConnected } = useCurrentWallet();

  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState<Array<LoanNft>>([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isConnected) fetchNFTs(1);
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) return;
    setPage(1);
    fetchNFTs(1);
  }, [isConnected, needReload, status]);

  useEffect(() => {
    fetchNFTs(page);
  }, [page]);

  const fetchNFTs = async (page: number) => {
    try {
      setLoading(true);
      const res = await getLoansByOwner({
        owner: currentWallet.address.toString(),
        network: currentWallet.chain.toString(),
        status,
        page,
        limit: pageSize,
      });
      setLoans(res.result.map(LoanNft.parseFromApi));
      setTotal(res.count);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected)
    return (
      <EmptyList dark labelText="Connect crypto wallet to view your assets" />
    );

  
  const templateColumns = columns.reduce((str, e) => str += `${e.flex}fr `, '');

  return (
    <div className={cx(isMobile && styles.mobileWrap, styles.wrapper)}>
      <Menu variant='outline'>
        <MenuButton mt={4} h='40px' minW='120px'>
          <Flex alignItems='center' justifyContent='space-between' pl={4} pr={2}>
            <Text>{status.toUpperCase() || 'ALL'}</Text>
            <Icon fontSize='xl' as={FaCaretDown} />
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setStatus('')}>All</MenuItem>
          {Object.values(LOAN_STATUS).map(v => (
            <MenuItem key={v.id} onClick={() => setStatus(v.id)}>{v.name}</MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Flex direction='column' className={styles.table}>
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
        {loading && <Loading className={styles.loading} />}
        {!loading && loans?.length === 0 && (
          <EmptyList dark labelText="There is no loan" />
        )}
        {loans.map((e: LoanNft) => <Item key={e.id} templateColumns={templateColumns} loan={e} />)}
      </Flex>
      <Flex justifyContent='flex-end'>
        <Pagination total={total} page={page} pageSize={pageSize} onChangePage={setPage} />
      </Flex>
    </div>
  );
};

export default ListLoan;
