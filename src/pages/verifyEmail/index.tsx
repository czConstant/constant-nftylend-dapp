import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Flex, Grid, GridItem, Heading, Icon, Text } from '@chakra-ui/react'
import { BsShieldCheck } from 'react-icons/bs'
import queryString from 'query-string'

import { APP_URL } from 'src/common/constants/url'
import BodyContainer from 'src/common/components/bodyContainer'

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(3)

  useEffect(() => {
    const pageQuery: any = queryString.parse(location.search);
  }, []);

  const verifyEmail = async () => {
    try {

    } finally {
      setLoading(false);
    }
  };

  return (
    <BodyContainer>
      <Flex direction='column' alignItems='center'>
        <Flex alignItems='center' gap={4}>
          <Icon as={BsShieldCheck} />
          <Heading as='h1'>Your email has been verified</Heading>
        </Flex>
        <Text>Proceed to NFT Pawn after {count}</Text>
      </Flex>
    </BodyContainer>
  );
};

export default VerifyEmail;
