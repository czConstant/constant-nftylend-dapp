import { Box, Button, Flex, Grid, GridItem, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Pagination from 'src/common/components/pagination';
import { formatCurrency } from 'src/common/utils/format';
import { getBalanceTransactions, getPwpBalance } from 'src/modules/nftLend/api';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';

const MyPwp = () => {
  const { currentWallet } = useCurrentWallet();

  const [pwpBalance, setPwpBalance] = useState<any>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getPwpBalance(currentWallet.address, currentWallet.chain).then(res => {
      setPwpBalance(res.result);
    });
    getBalanceTransactions(currentWallet.address, currentWallet.chain).then(res => {
      setTransactions(res.result);
      setTotal(res.count);
    });
  }, [])

  return (
    <Flex direction='column' gap={12}>
      <Grid w='100%' templateColumns='repeat(4, 1fr)' gap={4}>
        <GridItem>
          <Box backgroundColor='background.card' borderRadius={16} p={4}>
            <Text fontSize='sm' color='text.secondary'>Total Reward</Text>
            <Text fontSize='2xl' fontWeight='bold'>
              {formatCurrency(pwpBalance?.balance)} PWP
            </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box backgroundColor='background.card' borderRadius={16} p={4}>
            <Text fontSize='sm' color='text.secondary'>Claimable Reward</Text>
            <Flex justifyContent='space-between'>
              <Text fontSize='2xl' fontWeight='bold'>
                {formatCurrency(pwpBalance?.balance - pwpBalance?.locked_balance)} PWP
              </Text>
              <Button size='sm'>Claim</Button>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
      <TableContainer borderRadius={16}>
        <Table variant='striped' borderRadius={16}>
          <Thead>
            <Tr color='text.primary'>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((e, i) => {
              const isLast = i === transactions.length - 1;
              return (
                <Tr key={e.id}>
                  <Td borderBottomLeftRadius={isLast ? 16 : 0}>{e.created_at}</Td>
                  <Td>{e.amount} {e.currency.symbol}</Td>
                  <Td borderBottomRightRadius={isLast ? 16 : 0}>{e.status}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
        <Flex p={4} w='100%' justifyContent='flex-end'>
          <Pagination total={total} page={page} pageSize={pageSize} onChangePage={(p: number) => setPage(p)} />
        </Flex>
      </TableContainer>
    </Flex>
  );
};

export default MyPwp;