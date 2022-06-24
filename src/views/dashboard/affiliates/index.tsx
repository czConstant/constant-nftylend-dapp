import { Box, Button, Flex, Grid, GridItem, Icon, Text } from '@chakra-ui/react'
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from 'react-icons/md';

import { toastSuccess } from 'src/common/services/toaster';
import { formatCurrency } from 'src/common/utils/format';
import { getAffiliateStats, getUserNearBalance } from 'src/modules/nftLend/api';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet'
import { AffiliateStatsData, UserBalanceData } from 'src/modules/nftLend/models/api';
import VolumeChart from './volumeChart';

const Affiliates = () => {
  const { currentWallet } = useCurrentWallet()

  const [claiming, setClaiming] = useState(false)
  const [stats, setStats] = useState<AffiliateStatsData>()
  const [nearBalance, setNearBalance] = useState<UserBalanceData>()

  useEffect(() => {
    getAffiliateStats('hieuq.testnet', currentWallet.chain).then(res => {
      setStats(res.result)
    })
    getUserNearBalance('hieuq.testnet', currentWallet.chain).then(res => {
      setNearBalance(res.result)
    })
  }, [])

  const affiliateUrl = `https://nftpawn.financial?r=${currentWallet.address}`
  const amount = new BigNumber(nearBalance?.balance || 0).minus(nearBalance?.locked_balance || 0).toNumber()
  const canClaim = amount > 0 && nearBalance?.currency?.claim_enabled

  return (
    <Flex direction='column' gap={8}>
      <Grid templateColumns='1.5fr repeat(2, 1fr)' gap={4}>
        <GridItem>
          <Flex h='100%' direction='column' justifyContent='space-between' backgroundColor='background.card' borderRadius={16} p={4}>
            <Text fontSize='sm' color='text.secondary'>Affiliate URL</Text>
            <Flex alignItems='center' justifyContent='space-between'>
              <Text fontSize='md' fontWeight='semibold'>{affiliateUrl}</Text>
              <CopyToClipboard
                onCopy={() => toastSuccess("Copied address!")}
                text={affiliateUrl}
              >
                <Icon cursor='pointer' as={MdContentCopy} />
              </CopyToClipboard>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex h='100%' direction='column' justifyContent='space-between' backgroundColor='background.card' borderRadius={16} p={4}>
            <Text fontSize='sm' color='text.secondary'>Commission Amount</Text>
            <Flex justifyContent='space-between'>
              <Text fontSize='2xl' fontWeight='bold'>{formatCurrency(amount)} {nearBalance?.currency?.symbol}</Text>
              <Button disabled={!canClaim} isLoading={claiming} size='sm'>Redeem</Button>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex h='100%' direction='column' justifyContent='space-between' backgroundColor='background.card' borderRadius={16} p={4}>
            <Text fontSize='sm' color='text.secondary'>Revenue Share</Text>
            <Text fontSize='2xl' fontWeight='bold'>{stats?.commissions_rate * 100}%</Text>
          </Flex>
        </GridItem>
      </Grid>
      <Grid templateColumns='4fr 1fr' gap={4}>
        <GridItem>
          <VolumeChart />
        </GridItem>
        <GridItem>
          <Flex direction='column' flex={1} gap={2}>
            <Flex direction='column' backgroundColor='background.card' borderRadius={16} p={4}>
              <Text fontSize='sm' color='text.secondary'>Total Revenue</Text>
              <Text fontSize='2xl' fontWeight='bold'>${formatCurrency(stats?.total_commissions)}</Text>
            </Flex>
            <Flex direction='column' backgroundColor='background.card' borderRadius={16} p={4}>
              <Text fontSize='sm' color='text.secondary'>Total Users</Text>
              <Text fontSize='2xl' fontWeight='bold'>{formatCurrency(stats?.total_users)}</Text>
            </Flex>
            <Flex direction='column' backgroundColor='background.card' borderRadius={16} p={4}>
              <Text fontSize='sm' color='text.secondary'>Total TXs</Text>
              <Text fontSize='2xl' fontWeight='bold'>{formatCurrency(stats?.total_transactions)}</Text>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
    </Flex>
  )
}

export default Affiliates