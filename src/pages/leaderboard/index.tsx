import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import moment from 'moment-timezone';
import { useLocation, Navigate } from 'react-router-dom';

import BodyContainer from 'src/common/components/bodyContainer';
import { APP_URL } from 'src/common/constants/url';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import Countdown from 'src/views/leaderboard/countdown';
import TopBorrower from 'src/views/leaderboard/topBorrower';

const Leaderboard = () => {
  const { isConnected } = useCurrentWallet()

  if (!isConnected) return <Navigate to={APP_URL.HOME} />

  return (
    <BodyContainer>
      <Flex alignItems='center' justifyContent='space-between' m={8}>
        <Box>
          <Heading as='h1'>Leaderboard</Heading>
          <Text fontWeight='medium' fontSize='xl' color='brand.warning.400'>{moment().format('MMM-YYYY')}</Text>
        </Box>
        <Box><Countdown /></Box>
      </Flex>
      <Flex>
        <Box flex={1} />
        <Box>
          <TopBorrower />
        </Box>
      </Flex>
    </BodyContainer>
  )
};

export default Leaderboard