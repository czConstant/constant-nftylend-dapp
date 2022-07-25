import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { getBorrowerStats } from 'src/modules/nftLend/api'
import { Chain } from 'src/common/constants/network'
import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { formatCurrency } from 'src/common/utils/format'
import InfoTooltip from 'src/common/components/infoTooltip'

interface BorrowerStatsProps {
  address: string
}

const BorrowerStats = (props: BorrowerStatsProps) => {
  const { address } = props

  const [stats, setStats] = useState<any>()

  useEffect(() => {
    getBorrowerStats(address, Chain.Near).then(res => {
      setStats(res.result)
    })
  }, [address])

  const rate = new BigNumber(stats?.total_done_loans).dividedBy(stats?.total_loans).multipliedBy(100).toNumber();
  let color = 'brand.danger.600'
  if (rate > 50) color = 'brand.warning.400'
  if (rate > 75) color = '#ddc014'
  if (rate > 95) color = 'brand.success.600'
  if (!rate) color ='text.secondary'
    
  return (
    <Grid w='100%' templateColumns='1.5fr repeat(3, 1fr)' gap={4}>
      <GridItem>
        <Box backgroundColor='background.card' borderRadius={16} p={4}>
          <Flex gap={2} alignItems='center'>
            <Text color='text.secondary' fontSize='sm'>Address</Text>
          </Flex>
          <Text fontWeight='semibold' fontSize='3xl'>{address}</Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box backgroundColor='background.card' borderRadius={16} p={4}>
          <Flex gap={2} alignItems='center'>
            <Text color='text.secondary' fontSize='sm'>Repayment rate</Text>
            <InfoTooltip label={`The percentage of times a lender has been paid back on the total loans at the end of their terms.`} />
          </Flex>
          <Text fontWeight='semibold' fontSize='3xl' color={color}>{rate ? `${formatCurrency(rate)}%` : 'Not Available'}</Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box backgroundColor='background.card' borderRadius={16} p={4}>
          <Flex gap={2} alignItems='center'>
            <Text color='text.secondary' fontSize='sm'>Total loans</Text>
            <InfoTooltip label={`The total amount of the Loans outstanding to each Borrower, and 'Total Loans' means all such loans.`} />
          </Flex>
          <Text fontWeight='semibold' fontSize='3xl'>{formatCurrency(stats?.total_loans)}</Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box backgroundColor='background.card' borderRadius={16} p={4}>
          <Flex gap={2} alignItems='center'>
            <Text color='text.secondary' fontSize='sm'>Total volume</Text>
            <InfoTooltip label={`Loan volume refers to the total loan volume originated by a lender that has been funded and closed.`} />
          </Flex>
          <Text fontWeight='semibold' fontSize='3xl'>${formatCurrency(stats?.total_volume)}</Text>
        </Box>
      </GridItem>
    </Grid>
  )
}

export default BorrowerStats