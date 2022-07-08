import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import moment from 'moment-timezone';

import BodyContainer from 'src/common/components/bodyContainer';
import ButtonCreateLoan from 'src/common/components/buttonCreateLoan';
import Countdown from 'src/views/leaderboard/countdown';
import ProgramDetail from 'src/views/leaderboard/programDetail';
import TopBorrower from 'src/views/leaderboard/topBorrower';

import ImgReward from './reward.png'

const Leaderboard = () => {
  return (
    <BodyContainer>
      <Flex alignItems='center' justifyContent='space-between' m={8}>
        <Box>
          <Heading as='h1'>Leadership Ranking</Heading>
          <Text fontWeight='medium' fontSize='xl' color='brand.warning.400'>{moment().format('MMM-YYYY')}</Text>
        </Box>
        <Box><Countdown /></Box>
      </Flex>
      <Flex mb={16}>
        <Flex flex={1} alignItems='center' direction='column' gap={8}>
          <Image src={ImgReward} />
          <Box>
            <ButtonCreateLoan />
          </Box>
        </Flex>
        <Box>
          <TopBorrower />
        </Box>
      </Flex>
      <Box mb={8}>
        <ProgramDetail />
      </Box>
    </BodyContainer>
  )
};

export default Leaderboard