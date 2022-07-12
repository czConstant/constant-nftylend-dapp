import { Box, Button, Flex, Icon } from '@chakra-ui/react';
import { Link, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import last from 'lodash/last';
import { MdAccountBalance, MdDashboard } from 'react-icons/md';
import { GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { FaHandshake } from 'react-icons/fa';

import BodyContainer from 'src/common/components/bodyContainer';
import Overview from 'src/views/dashboard/overview';
import MyLoans from 'src/views/dashboard/myLoans';
import MyOffers from 'src/views/dashboard/myOffers';
import MyAssets from 'src/views/dashboard/myAssets';
import Affiliates from 'src/views/dashboard/affiliates';
import { APP_URL } from 'src/common/constants/url';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import styles from "./styles.module.scss";
import { useAppSelector } from 'src/store/hooks';
import { selectUserSettings } from 'src/store/nftyLend';
import { useEffect } from 'react';

const menus = [
  { title: 'Overview', path: '', element: <Overview />, icon: MdDashboard },
  { title: 'My NFTs', path: 'nfts', element: <MyAssets />, icon: MdAccountBalance },
  { title: 'Loans', path: 'loans', element: <MyLoans />, icon: GiReceiveMoney },
  { title: 'Lends', path: 'lends', element: <MyOffers />, icon: GiPayMoney },
  { title: 'Affiliates', path: 'affiliates', element: <Affiliates />, icon: FaHandshake },
]

const Dashboard = () => {
  const location = useLocation()
  const { isConnected, connectNearWallet } = useCurrentWallet()
  const userSettings = useAppSelector(selectUserSettings)

  useEffect(() => {
    if (!isConnected) setTimeout(() => connectNearWallet(), 1000)
  }, [isConnected])

  // if (!isConnected) return <Navigate to={APP_URL.HOME} />

  return (
    <BodyContainer>
      <Flex pt={20} gap={8}>
        <Box className={styles.menuWrapper}>
          <Flex direction='column' gap={2} className={styles.menu}>
            {menus.map(e => {
              if (e.path === 'affiliates' && userSettings.type !== 'affiliate') return null
              const isOverview = e.path === '' && location.pathname === APP_URL.DASHBOARD
              const active = isOverview || e.path === last(location.pathname.split('/'))
              return (
                <Link key={e.title} to={e.path} style={{ textDecoration: 'none' }}>
                  <Button minW={200} variant={active ? 'solid' : 'ghost'} justifyContent='left' borderRadius={8} _hover={{ textDecoration: 'none' }} color={active ? 'text.primary' : 'text.secondary'}>
                    <Icon as={e.icon} fontSize={20} mr={2} /> {e.title}
                  </Button>
                </Link>
              )
            })}
          </Flex>
        </Box>
        <Box flex={1}>
          <Routes>
            {menus.map(e => {
              if (e.path === 'affiliates' && userSettings.type !== 'affiliate') return null
              return (
                <Route key={e.path} path={e.path} element={e.element} />
              )
            })}
          </Routes>
        </Box>
      </Flex>
    </BodyContainer>
  )
};

export default Dashboard