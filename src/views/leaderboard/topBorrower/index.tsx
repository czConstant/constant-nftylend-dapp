import { Flex, Icon, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { GiPodiumWinner, GiPodiumSecond, GiPodiumThird } from 'react-icons/gi';
import InfoTooltip from 'src/common/components/infoTooltip';
import { formatCurrency } from 'src/common/utils/format';

const data = [
  { wallet: 'locnp.near', matching: 100, matched: 88, total: 188 },
  { wallet: 'trihuynh.near', matching: 80, matched: 50, total: 130 },
  { wallet: 'hieuq.near', matching: 90, matched: 35, total: 125 },
  { wallet: 'duynguyen.near', matching: 40, matched: 60, total: 100 },
  { wallet: 'dungt.near', matching: 40, matched: 60, total: 100 },
  { wallet: 'zon.near', matching: 40, matched: 60, total: 100 },
  { wallet: '', matching: 40, matched: 60, total: 100 },
  { rank: 24, wallet: 'locmc.near', matching: 40, matched: 30, total: 70 },
]

const TopBorrower = () => {
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
            return (
              <Tr key={e.wallet}>
                <Td textAlign='center' w={10}>
                  {i === 0 && <Icon fontSize='2xl' mr={2} color='brand.warning.300' as={GiPodiumWinner} />}
                  {i === 1 && <Icon fontSize='2xl' mr={2} color='text.primary' as={GiPodiumSecond} />}
                  {i === 2 && <Icon fontSize='2xl' mr={2} color='text.secondary' as={GiPodiumThird} />}
                  {isEmpty ? '...' : i > 2 && (e.rank || i+1)}
                </Td>
                <Td>{isEmpty ? '...' : e.wallet}</Td>
                <Td textAlign='right'>{isEmpty ? '...' : formatCurrency(e.matching)}</Td>
                <Td textAlign='right'>{isEmpty ? '...' : formatCurrency(e.matched)}</Td>
                <Td textAlign='right'>{isEmpty ? '...' : formatCurrency(e.total)}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default TopBorrower