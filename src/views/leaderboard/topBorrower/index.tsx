import { Box, Flex, Icon, Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { GiPodiumWinner, GiPodiumSecond, GiPodiumThird } from 'react-icons/gi';
import InfoTooltip from 'src/common/components/infoTooltip';
import { formatCurrency } from 'src/common/utils/format';
import { isSameAddress } from 'src/common/utils/helper';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';

import IcRank1 from './ic_rank_1.png'
import IcRank2 from './ic_rank_2.png'
import IcRank3 from './ic_rank_3.png'
import IcRank4 from './ic_rank_4.png'
import IcRank5 from './ic_rank_5.png'

const data = [
  { wallet: 'trihuynh.near', matching: 100, matched: 88, total: 188 },
  { wallet: 'loc.near', matching: 80, matched: 50, total: 130 },
  { wallet: 'hieuq.near', matching: 90, matched: 35, total: 125 },
  { wallet: 'duynguyen.near', matching: 40, matched: 60, total: 100 },
  { wallet: 'dungt.near', matching: 40, matched: 60, total: 100 },
  { wallet: '', matching: 40, matched: 60, total: 100 },
  { rank: 24, wallet: 'locmc.testnet', matching: 40, matched: 30, total: 70 },
]

const TopBorrower = () => {
  const { currentWallet } = useCurrentWallet()

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
          {data.map((e, i) => {
            const isEmpty = !e.wallet
            const isMe = isSameAddress(e.wallet, currentWallet.address)
            return (
              <Tr key={e.wallet} borderColor='brand.primary.400' borderWidth={isMe ? 2 : 0} zIndex={isMe ? 1 : 0}>
                <Td textAlign='center' justifyContent='center'>
                  {i === 0 && <Image mx='auto' alignItems='center' w={8} src={IcRank1} />}
                  {i === 1 && <Image mx='auto' w={7} src={IcRank2} />}
                  {i === 2 && <Image mx='auto' w={7} src={IcRank3} />}
                  {i === 3 && <Image mx='auto' w={7} src={IcRank4} />}
                  {i === 4 && <Image mx='auto' w={7} src={IcRank5} />}
                  {isEmpty ? '...' : i > 4 && (e.rank || i+1)}
                </Td>
                <Td>{isEmpty ? '...' : e.wallet}</Td>
                <Td textAlign='right'>{isEmpty ? '...' : formatCurrency(e.matching)}</Td>
                <Td textAlign='right'>{isEmpty ? '...' : formatCurrency(e.matched)}</Td>
                <Td textAlign='right'>{isEmpty ? '...' : formatCurrency(e.total)}</Td>
              </Tr>
            )
          })}
          <Tr fontWeight='bold'>
            <Td />
            <Td>Total</Td>
            <Td textAlign='right'>212</Td>
            <Td textAlign='right'>325</Td>
            <Td textAlign='right'>537</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default TopBorrower