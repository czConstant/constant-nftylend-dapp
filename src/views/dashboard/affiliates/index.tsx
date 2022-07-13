import { Box, Button, Flex, Grid, GridItem, Icon, Text } from '@chakra-ui/react'
import BigNumber from 'bignumber.js';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from 'react-icons/md';
import InfoTooltip from 'src/common/components/infoTooltip';
import { MCT_ROOT } from 'src/common/constants/config';

import { toastError, toastSuccess } from 'src/common/services/toaster';
import { formatCurrency } from 'src/common/utils/format';
import { nearSignText } from 'src/modules/near/utils';
import { claimCurrencyBalance, getAffiliateStats, getUserNearBalance } from 'src/modules/nftLend/api';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet'
import { AffiliateStatsData, UserBalanceData } from 'src/modules/nftLend/models/api';
import { useAppSelector } from 'src/store/hooks';
import { selectUserSettings } from 'src/store/nftyLend';
import AffiliateHistory from './history';
import VolumeChart from './volumeChart';

const Affiliates = () => {
  const { currentWallet } = useCurrentWallet()
  const { username } = useAppSelector(selectUserSettings)

  const [claiming, setClaiming] = useState(false)
  const [stats, setStats] = useState<AffiliateStatsData>()
  const [nearBalance, setNearBalance] = useState<UserBalanceData>()

  useEffect(() => {
    getAffiliateStats(currentWallet.address, currentWallet.chain).then(res => {
      setStats(res.result)
    })
    getUserNearBalance(currentWallet.address, currentWallet.chain).then(res => {
      setNearBalance(res.result)
    })
  }, [])

  const onClaim = async () => {
    if (!nearBalance) return;
    try {
      const amount = new BigNumber(nearBalance.balance).minus(nearBalance.locked_balance)
      const timestamp = moment().unix()
      const signature = await nearSignText(currentWallet.address, String(timestamp))
      await claimCurrencyBalance({ 
        address: currentWallet.address,
        network: currentWallet.chain,
        timestamp,
        signature,
        currency_id: nearBalance.currency.id,
        amount: amount.toNumber(),
      })
      toastSuccess('Claimed successfully')
    } catch (err: any) {
      toastError(err?.message)
    } finally {
      setClaiming(false)
    }
  }

  const affiliateUrl =  `${MCT_ROOT}?r=${username}`
  const amount = new BigNumber(nearBalance?.balance || 0).minus(nearBalance?.locked_balance || 0).toNumber()
  const canClaim = amount > 0 && nearBalance?.currency?.claim_enabled

  return (
    <Flex direction='column' gap={8}>
      <Grid templateColumns='1.5fr repeat(2, 1fr)' gap={4}>
        <GridItem>
          <Flex h='100%' direction='column' justifyContent='space-between' backgroundColor='background.card' borderRadius={16} p={4}>
            <Flex gap={2} alignItems='flex-end'><Text fontSize='sm' color='text.secondary'>Affiliate URL</Text><InfoTooltip label="Affiliates who reach NFTPawn using this URL link and execute orders within 60 days will be considered for the affiliate program by Affliliater; otherwise, it will be calculated as organic traffic." /></Flex>
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
              <Button disabled={!canClaim} isLoading={claiming} size='sm' onClick={onClaim}>Redeem</Button>
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
              <Text fontSize='2xl' fontWeight='bold'>{formatCurrency(stats?.total_commissions)} {nearBalance?.currency?.symbol}</Text>
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
      <AffiliateHistory />
    </Flex>
  )
}

export default Affiliates