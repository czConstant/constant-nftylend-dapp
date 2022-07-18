import { useEffect, useState } from 'react'
import { Box, Flex, Heading } from '@chakra-ui/react'

import { LoanNft } from 'src/modules/nftLend/models/loan'
import { getLoansByOwner } from 'src/modules/nftLend/api'
import CardNftLoan from '../app/CardNftLoan'

interface PendingLoansProps {
  address: string
}

const PendingLoans = (props: PendingLoansProps) => {
  const { address } = props

  const [loans, setLoans] = useState<LoanNft[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLoans()
  }, [address])

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await getLoansByOwner({ owner: address, page: 0, limit: 500, status: 'new' })
      setLoans(res.result.map(LoanNft.parseFromApi))
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading fontSize='2xl' as='h2' mb={8}>Pending Loans</Heading>
      <Flex gap={4} overflow='scroll'>
        {loans.map((loan) => loan.asset && (
          <Box w={300}>
            <CardNftLoan key={loan.id} asset={loan.asset} loan={loan} />
          </Box>
        ))}
      </Flex>
    </Box>
  )
}

export default PendingLoans