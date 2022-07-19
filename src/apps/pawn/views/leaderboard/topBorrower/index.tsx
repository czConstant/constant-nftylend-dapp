import { Box, Flex, Icon, Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import InfoTooltip from 'src/common/components/infoTooltip';
import Loading from 'src/common/components/loading';
import { Chain } from 'src/common/constants/network';
import { formatCurrency } from 'src/common/utils/format';
import { isSameAddress } from 'src/common/utils/helper';
import { getLeaderboard } from 'src/modules/nftLend/api';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { BorrowerData } from 'src/modules/nftLend/models/api';

import IcRank1 from './ic_rank_1.png'
import IcRank2 from './ic_rank_2.png'
import IcRank3 from './ic_rank_3.png'
import IcRank4 from './ic_rank_4.png'
import IcRank5 from './ic_rank_5.png'

// const data = [
//   { wallet: 'trihuynh.near', matching: 100, matched: 88, total: 188 },
//   { wallet: 'loc.near', matching: 80, matched: 50, total: 130 },
//   { wallet: 'hieuq.near', matching: 90, matched: 35, total: 125 },
//   { wallet: 'duynguyen.near', matching: 40, matched: 60, total: 100 },
//   { wallet: 'dungt.near', matching: 40, matched: 60, total: 100 },
//   { wallet: '', matching: 40, matched: 60, total: 100 },
//   { rank: 24, wallet: 'locmc.testnet', matching: 40, matched: 30, total: 70 },
// ]

interface TopBorrowerProps {
  borrowers: BorrowerData[]
  loading: boolean
}

const TopBorrower = (props: TopBorrowerProps) => {
  const { borrowers, loading } = props
  const { currentWallet, isConnected } = useCurrentWallet()

  const [listBorrowers, setListBorrowers] = useState<BorrowerData[]>([])
  const [total, setTotal] = useState({ matching: 0, matched: 0 })

  useEffect(() => {
    if (!Array.isArray(borrowers)) return
    let list: BorrowerData[] = []
    let matching = 0
    let matched = 0
    borrowers.forEach((e: BorrowerData, i: number) => {
      matching += e.matching_point
      matched += e.matched_point
      if (i <= 4) list.push(e)
      if (isSameAddress(e.user.address, currentWallet.address)) {
        if (i > 4) list.push(e)
      }
    })
    setListBorrowers(list)
    setTotal({ matching, matched})
  }, [borrowers, isConnected])

  return (
    <TableContainer color='text.primary' borderRadius={16}>
      <Table variant='striped'>
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Wallet</Th>
            <Th><Flex alignItems='center' gap={2}>Matching <InfoTooltip label="Loans listed on NFTPawn Protocol and pending lenders to match" /></Flex></Th>
            <Th><Flex alignItems='center' gap={2}>Matched <InfoTooltip label="Lender and borrower have matched and the funds have been sent to the borrower's wallet" /></Flex></Th>
            <Th>Total Points</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading && <Tr><Td colSpan={5}><Loading /></Td></Tr>}
          {!loading && listBorrowers.map((e, i) => {
            const isMe = isSameAddress(e.user?.address, currentWallet.address)
            return (<>
              <Tr key={e.user_id} borderColor='brand.primary.400' borderWidth={isMe ? 2 : 0} zIndex={isMe ? 1 : 0}>
                <Td textAlign='center' justifyContent='center'>
                  {i === 0 && <Image mx='auto' alignItems='center' w={8} src={IcRank1} />}
                  {i === 1 && <Image mx='auto' w={7} src={IcRank2} />}
                  {i === 2 && <Image mx='auto' w={7} src={IcRank3} />}
                  {i === 3 && <Image mx='auto' w={7} src={IcRank4} />}
                  {i === 4 && <Image mx='auto' w={7} src={IcRank5} />}
                  {i > 4 && i+1}
                </Td>
                <Td>{e.user?.address}</Td>
                <Td textAlign='right'>{formatCurrency(e.matching_point)}</Td>
                <Td textAlign='right'>{formatCurrency(e.matched_point)}</Td>
                <Td textAlign='right'>{formatCurrency(e.total_point)}</Td>
              </Tr>
              {(i === borrowers.length-1 || i === 4) && (
                <Tr key='empty'>
                  <Td textAlign='center' justifyContent='center'>...</Td>
                  <Td>...</Td>
                  <Td textAlign='right'>...</Td>
                  <Td textAlign='right'>...</Td>
                  <Td textAlign='right'>...</Td>
                </Tr>
              )}
            </>)
          })}
          <Tr fontWeight='bold'>
            <Td />
            <Td>Total</Td>
            <Td textAlign='right'>{formatCurrency(total.matching)}</Td>
            <Td textAlign='right'>{formatCurrency(total.matched)}</Td>
            <Td textAlign='right'>{formatCurrency(total.matching + total.matched)}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default TopBorrower