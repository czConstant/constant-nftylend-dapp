import { useEffect, useState } from 'react'
import { Box, Flex, Heading } from '@chakra-ui/react'

import { getOffersByFilter } from 'src/modules/nftLend/api'
import CardNftLoan from '../app/CardNftLoan'
import { OfferToLoan } from 'src/modules/nftLend/models/offer'
import EmptyList from 'src/common/components/emptyList'

interface PendingLendsProps {
  address: string
}

const PendingLends = (props: PendingLendsProps) => {
  const { address } = props

  const [offers, setOffers] = useState<OfferToLoan[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOffers()
  }, [address])

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await getOffersByFilter({ lender: address, page: 0, limit: 500, status: 'new' })
      setOffers(res.result.map(OfferToLoan.parseFromApi))
    } finally {
      setLoading(false);
    }
  };

  if (!loading && offers.length === 0) return null

  return (
    <Box>
      <Heading fontSize='2xl' as='h2' mb={8}>Pending Loans</Heading>
      <Flex gap={4} overflow='scroll'>
        {offers.map((offer) => offer?.loan?.asset && (
          <Box key={offer.id} w={300}>
            <CardNftLoan key={offer.loan.id} asset={offer.loan.asset} loan={offer.loan} />
          </Box>
        ))}
      </Flex>
    </Box>
  )
}

export default PendingLends