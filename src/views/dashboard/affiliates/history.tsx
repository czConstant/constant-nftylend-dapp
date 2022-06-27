import { useEffect, useState } from 'react';
import { Center, Flex, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';

import Pagination from 'src/common/components/pagination';
import { formatCurrency, formatDateTime, formatDuration, shortCryptoAddress } from 'src/common/utils/format';
import { getAffiliateTransactions } from 'src/modules/nftLend/api';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { PAWN_BALANCE_TX_TYPE } from 'src/modules/nftLend/constant';
import EmptyList from 'src/common/components/emptyList';

const DEFAULT_LIMIT = 10

const AffiliateHistory = () => {
  const { currentWallet } = useCurrentWallet();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_LIMIT);

  useEffect(() => {
    getAffiliateTransactions({
      address: currentWallet.address,
      network: currentWallet.chain,
      page,
      limit: pageSize,
    }).then(res => {
      setTransactions(res.result);
      setTotal(res.count);
    });
  }, [page])

  return (
    <Flex direction='column' gap={12}>
      <TableContainer borderRadius={16} color='text.primary' >
        <Table variant='striped' borderRadius={16}>
          <Thead>
            <Tr>
              <Th>Wallet</Th>
              <Th>Type</Th>
              <Th>Date</Th>
              <Th>Principle</Th>
              <Th>Interest</Th>
              <Th>Duration</Th>
              <Th>Commission</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((e, i) => {
              const isLast = i === transactions.length - 1;
              const txType = PAWN_BALANCE_TX_TYPE[e.type]
              const type = txType?.name || e.type
              const duration = e.loan?.approved_offer ? e.loan?.approved_offer.duration : e.loan?.duration;
              
              return (
                <Tr key={e.id}>
                  <Td borderBottomLeftRadius={isLast ? 16 : 0}>{shortCryptoAddress(e.loan?.owner)}</Td>
                  <Td>{type}</Td>
                  <Td>{formatDateTime(e.created_at)}</Td>
                  <Td>{formatCurrency(e.loan?.principal_amount)} {e.currency?.symbol}</Td>
                  <Td>{formatCurrency(e.loan?.interest_rate * 100)}%</Td>
                  <Td>{formatDuration(duration)}</Td>
                  <Td borderBottomRightRadius={isLast ? 16 : 0}>{formatCurrency(e.loan?.amount)} {e.currency?.symbol}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
        {transactions.length === 0 && <Center><EmptyList labelText="There is no transaction yet" /></Center>}
        <Flex p={4} w='100%' justifyContent='flex-end'>
          <Pagination total={total} page={page} pageSize={pageSize} onChangePage={(p: number) => setPage(p)} />
        </Flex>
      </TableContainer>
    </Flex>
  );
};

export default AffiliateHistory;