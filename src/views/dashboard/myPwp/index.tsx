import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import moment from 'moment-timezone';
import { Box, Button, Flex, Grid, GridItem, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';

import Pagination from 'src/common/components/pagination';
import { formatCurrency, formatDateTime } from 'src/common/utils/format';
import { nearSignText } from 'src/modules/near/utils';
import { claimPwpBalance, getBalanceTransactions, getPwpBalance } from 'src/modules/nftLend/api';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { PwpBalanceData } from 'src/modules/nftLend/models/api';
import { toastError, toastSuccess } from 'src/common/services/toaster';
import { INCENTIVE_TX_TYPE } from 'src/modules/nftLend/constant';

const MyPwp = () => {
  const { currentWallet } = useCurrentWallet();

  const [pwpBalance, setPwpBalance] = useState<PwpBalanceData>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [displayTransactions, setDisplayTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getPwpBalance(currentWallet.address, currentWallet.chain).then(res => {
      setPwpBalance(res.result);
    });
    getBalanceTransactions(currentWallet.address, currentWallet.chain).then(res => {
      setTransactions(res.result);
      setTotal(res.count);
    });
  }, [])

  useEffect(() => {
    setDisplayTransactions(transactions.slice((page-1)*pageSize, page * pageSize));
  }, [page, transactions])

  const onClaim = async () => {
    if (!pwpBalance) return;
    try {
      setSubmitting(true)
      const amount = new BigNumber(pwpBalance.balance).minus(pwpBalance.locked_balance)
      const timestamp = moment(pwpBalance.updated_at).unix()
      const message = `${currentWallet.address.toLowerCase()}-${pwpBalance.currency.contract_address}-${amount.toString(10)}-${timestamp}`
      const signature = await nearSignText(currentWallet.address, message)
      await claimPwpBalance({ 
        user_id: pwpBalance.user.id,
        currency_id: pwpBalance.currency.id,
        to_address: currentWallet.address,
        amount: amount.toNumber(),
        timestamp,
        signature,
      })
      toastSuccess('Claimed PWP successfully')
    } catch (err: any) {
      toastError(err?.message)
    } finally {
      setSubmitting(false)
    }
  }

  const amount = new BigNumber(pwpBalance?.balance || 0).minus(pwpBalance?.locked_balance || 0).toNumber()
  const canClaim = amount > 0 && pwpBalance?.currency?.claim_enabled

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
            <Text fontSize='sm' color='text.secondary'>Available Reward</Text>
            <Flex justifyContent='space-between'>
              <Text fontSize='2xl' fontWeight='bold'>
                {pwpBalance?.currency?.claim_enabled ? formatCurrency(amount) : 0} PWP
              </Text>
              <Button /* disabled={!canClaim} */ disabled isLoading={submitting} size='sm' onClick={onClaim}>Claim</Button>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
      <TableContainer borderRadius={16} color='text.primary' >
        <Table variant='striped' borderRadius={16}>
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Type</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayTransactions.map((e, i) => {
              const isLast = i === displayTransactions.length - 1;
              const txType = INCENTIVE_TX_TYPE[e.incentive_transaction?.type]
              return (
                <Tr key={e.id}>
                  <Td borderBottomLeftRadius={isLast ? 16 : 0}>{formatDateTime(e.created_at)}</Td>
                  <Td>{e.amount} {e.currency?.symbol}</Td>
                  <Td>{txType?.name || e.incentive_transaction?.type}</Td>
                  <Td borderBottomRightRadius={isLast ? 16 : 0}>{e.incentive_transaction?.status}</Td>
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