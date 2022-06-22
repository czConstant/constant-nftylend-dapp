import { Box, Button, Flex, Grid, GridItem, Icon, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from 'react-icons/md';

import { toastSuccess } from 'src/common/services/toaster';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet'
import VolumeChart from './volumeChart';

const Affiliates = () => {
  const { currentWallet } = useCurrentWallet()
  const [claiming, setClaiming] = useState(false)

  const affiliateUrl = `nftpawn.financial/?r=${currentWallet.address}`

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
              <Text fontSize='2xl' fontWeight='bold'>21,233 PWP</Text>
              <Button isLoading={claiming} size='sm'>Redeem</Button>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex h='100%' direction='column' justifyContent='space-between' backgroundColor='background.card' borderRadius={16} p={4}>
            <Text fontSize='sm' color='text.secondary'>Commission Amount</Text>
            <Flex justifyContent='space-between'>
              <Text fontSize='2xl' fontWeight='bold'>867 PWP</Text>
              <Button isLoading={claiming} size='sm'>Redeem</Button>
            </Flex>
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
              <Text fontSize='sm' color='text.secondary'>Revenue share</Text>
              <Text fontSize='2xl' fontWeight='bold'>5%</Text>
            </Flex>
            <Flex direction='column' backgroundColor='background.card' borderRadius={16} p={4}>
              <Text fontSize='sm' color='text.secondary'>Total Revenue</Text>
              <Text fontSize='2xl' fontWeight='bold'>$2,432</Text>
            </Flex>
            <Flex direction='column' backgroundColor='background.card' borderRadius={16} p={4}>
              <Text fontSize='sm' color='text.secondary'>Total Users</Text>
              <Text fontSize='2xl' fontWeight='bold'>126</Text>
            </Flex>
            <Flex direction='column' backgroundColor='background.card' borderRadius={16} p={4}>
              <Text fontSize='sm' color='text.secondary'>Total TXs</Text>
              <Text fontSize='2xl' fontWeight='bold'>12,387</Text>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
    </Flex>
  )
}

export default Affiliates