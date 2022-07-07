import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { formatCurrency } from 'src/common/utils/format';

const data = [
  { wallet: 'locnp.near', matching: 100, matched: 88, total: 188 },
  { wallet: 'trihuynh.near', matching: 80, matched: 50, total: 130 },
  { wallet: 'hieuq.near', matching: 90, matched: 35, total: 125 },
  { wallet: 'duynguyen.near', matching: 40, matched: 60, total: 100 },
]

const TopBorrower = () => {
  return (
    <TableContainer borderRadius={16} color='text.primary'>
      <Table variant='striped' borderRadius={16}>
        <Thead>
          <Tr>
            <Th>Ranking</Th>
            <Th>Wallet</Th>
            <Th>Matching</Th>
            <Th>Matched</Th>
            <Th>Total Point</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((e, i) => {
            const isLast = i === data.length - 1;
            return (
              <Tr key={e.wallet}>
                <Td borderBottomLeftRadius={isLast ? 16 : 0}>{i+1}</Td>
                <Td>{e.wallet}</Td>
                <Td textAlign='right'>{formatCurrency(e.matching)}</Td>
                <Td textAlign='right'>{formatCurrency(e.matched)}</Td>
                <Td textAlign='right' borderBottomRightRadius={isLast ? 16 : 0}>{formatCurrency(e.total)}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default TopBorrower