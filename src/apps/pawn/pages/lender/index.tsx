import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { Flex } from '@chakra-ui/react'

import BodyContainer from 'src/common/components/bodyContainer'
import LendHistory from 'src/apps/pawn/views/lender/lendHistory'
import PendingLends from 'src/apps/pawn/views/lender/pendingLends'
import LenderStats from 'src/apps/pawn/views/lender/stats'

const PageLender = () => {
  const location = useLocation()
  const query = queryString.parse(location.search)
  const address = String(query.address)

  return (
    <BodyContainer>
      <Flex direction='column' gap={12} py={8}>
        <LenderStats address={address} />
        <PendingLends address={address} />
        <LendHistory address={address} />
      </Flex>
    </BodyContainer>
  )
}

export default PageLender