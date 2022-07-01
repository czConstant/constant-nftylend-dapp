import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { BsShieldCheck, BsShieldX } from 'react-icons/bs'
import queryString from 'query-string'

import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet'
import { APP_URL } from 'src/common/constants/url'
import BodyContainer from 'src/common/components/bodyContainer'
import { getUserSettings, verifyEmailToken } from 'src/modules/nftLend/api'
import styles from './styles.module.scss'
import { useAppDispatch } from 'src/store/hooks'
import { updateUserSettings } from 'src/store/nftyLend'

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isConnected, currentWallet } = useCurrentWallet()
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(-1)
  const [error, setError] = useState('')

  useEffect(() => {
    const pageQuery: any = queryString.parse(location.search);
    if (pageQuery.email && pageQuery.token) {
      verifyEmailToken(pageQuery.email, pageQuery.token).then(() => {
        if (isConnected) getUserSettings(currentWallet.address, currentWallet.chain).then(res => {
          dispatch(updateUserSettings(res.result))
        })
        setTimeout(() => {
          setLoading(false)
          setCount(3)
        }, 3000)
      }).catch(err => {
        setLoading(false)
        if (err.code === -2001) {
          setError('Your email verification is limited in 10 minutes')
        } else if (err.code === -2002) {
          setError('Your email verification link is expired')
        } else if (err.code === -2003) {
          setError('Your email verification is invalid')
        } else if (err.code === -2004) {
          setError('Your email verification is limited 5 requests in 24 hours')
        } else setError(err.message)
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
        {error
          ? (
            <Flex alignItems='center' gap={4}>
              <Icon fontSize='6xl' color='brand.danger.600' as={BsShieldX} />
              <Heading as='h1'>{error}</Heading>
            </Flex>
          ) : loading
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
            </>
        }
      </Flex>
    </BodyContainer>
  );
};

export default VerifyEmail;
