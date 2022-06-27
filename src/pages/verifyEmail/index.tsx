import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { BsShieldCheck } from 'react-icons/bs'
import queryString from 'query-string'

import { APP_URL } from 'src/common/constants/url'
import BodyContainer from 'src/common/components/bodyContainer'
import { verifyEmailToken } from 'src/modules/nftLend/api'
import styles from './styles.module.scss'

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(-1)

  useEffect(() => {
    const pageQuery: any = queryString.parse(location.search);
    if (pageQuery.email && pageQuery.token) {
      verifyEmailToken(pageQuery.email, pageQuery.token).then(() => {
        setTimeout(() => {
          setLoading(false)
          setCount(3)
        }, 3000)
      })
    }
  }, []);

  useEffect(() => {
    if (count === -1) return
    setTimeout(() => setCount(count - 1), 1000)
    if (count === 0) return navigate(APP_URL.HOME)
  }, [count])

  return (
    <BodyContainer>
      <Flex mt={40} direction='column' alignItems='center' gap={8}>
        {loading
          ? (
            <Flex alignItems='center' gap={4}>
              <Icon fontSize='6xl' color='brand.warning.600' as={BsShieldCheck} />
              <Heading as='h1' className={styles.dotLoading}>Verifying email ...</Heading>
            </Flex>
          ) : <>
            <Flex alignItems='center' gap={4}>
              <Icon fontSize='6xl' color='brand.success.600' as={BsShieldCheck} />
              <Heading as='h1' color='brand.success.600'>Your email has been verified</Heading>
            </Flex>
            <Text fontSize='xl'>Proceed to NFT Pawn after {count}</Text>
          </>}
      </Flex>
    </BodyContainer>
  );
};

export default VerifyEmail;
