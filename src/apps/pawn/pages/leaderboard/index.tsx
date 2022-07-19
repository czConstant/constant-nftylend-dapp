import { useEffect, useState } from 'react';
import { Box, Flex, Heading, Icon, Image, Text } from '@chakra-ui/react';
import moment from 'moment-timezone';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import BodyContainer from 'src/common/components/bodyContainer';
import ButtonCreateLoan from 'src/common/components/buttonCreateLoan';
import Countdown from 'src/apps/pawn/views/leaderboard/countdown';
import ProgramDetail from 'src/apps/pawn/views/leaderboard/programDetail';
import TopBorrower from 'src/apps/pawn/views/leaderboard/topBorrower';

import { getLeaderboard } from 'src/modules/nftLend/api';
import { Chain } from 'src/common/constants/network';
import { BorrowerData } from 'src/modules/nftLend/models/api';

const Leaderboard = () => {
  const [date, setDate] = useState(moment().startOf('M'))
  const [borrowers, setBorrowers] = useState<BorrowerData[]>([])
  const [detail, setDetail] = useState<any>()
  const [prevDetail, setPrevDetail] = useState<any>()
  const [loading, setLoading] = useState(false)

  const havePrev = !!prevDetail
  const haveNext = moment().isAfter(date, 'M')

  useEffect(() => {
    fetchData()
  }, [date])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await getLeaderboard(moment(date).format('yyyy-MM-DD'), Chain.Near)
      setBorrowers(res.result.results)
      setDetail(res.result.detail)
      setPrevDetail(res.result.prev_detail)
    } finally {
      setLoading(false)
    }
  }

  const onPrev = () => {
    setDate(date.clone().subtract(1, 'M'))
  }

  const onNext = () => {
    setDate(date.clone().add(1, 'M'))
  }

  return (
    <BodyContainer>
      <Flex alignItems='center' justifyContent='space-between' m={8}>
        <Box>
          <Flex alignItems='center' gap={4}>
            {havePrev && <Icon onClick={onPrev} fontSize='4xl' as={MdChevronLeft} cursor='pointer' />}
            <Text w='200px' fontWeight='bold' fontSize='4xl' color='brand.warning.400'>{date.format('MMM-YYYY')}</Text>
            {haveNext && <Icon onClick={onNext} fontSize='4xl' as={MdChevronRight} cursor='pointer' />}
          </Flex>
          <Heading as='h1' fontSize='2xl' fontWeight='medium'>Leadership Ranking</Heading>
        </Box>
        {moment().isSame(date, 'M') && <Box><Countdown /></Box>}
      </Flex>
      <Flex mb={16}>
        <Flex maxW='600px' alignItems='center' direction='column' gap={8}>
          <Image src={detail?.image_url} />
          <Box>
            <ButtonCreateLoan />
          </Box>
        </Flex>
        <Box flex={1}>
          <TopBorrower loading={loading} borrowers={borrowers} />
        </Box>
      </Flex>
      <Box mb={8}>
        <ProgramDetail detail={detail} />
      </Box>
    </BodyContainer>
  )
};

export default Leaderboard