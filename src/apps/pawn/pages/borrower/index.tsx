import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { Flex } from '@chakra-ui/react'

import BodyContainer from 'src/common/components/bodyContainer'
import BorrowerStats from 'src/apps/pawn/views/borrower/stats'
import PendingLoans from 'src/apps/pawn/views/borrower/pendingLoans'

const PageBorrower = () => {
  const location = useLocation()
  const query = queryString.parse(location.search)
  const address = String(query.address)

  return (
    <BodyContainer>
      <Flex direction='column' gap={12} pt={8}>
        <BorrowerStats address={address} />
        <PendingLoans address={address} />
      </Flex>
    </BodyContainer>
  )
}

export default PageBorrower