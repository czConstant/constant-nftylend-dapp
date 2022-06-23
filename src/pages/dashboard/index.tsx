import { Box, Button, Flex } from '@chakra-ui/react';
import { Link, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import last from 'lodash/last';

import BodyContainer from 'src/common/components/bodyContainer';
import Overview from 'src/views/dashboard/overview';
import MyLoans from 'src/views/dashboard/myLoans';
import MyOffers from 'src/views/dashboard/myOffers';
import MyAssets from 'src/views/dashboard/myAssets';
import { APP_URL } from 'src/common/constants/url';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import styles from "./styles.module.scss";

const menus = [
  { title: 'Overview', path: '', element: <Overview /> },
  { title: 'My NFTs', path: 'nfts', element: <MyAssets /> },
  { title: 'Loans', path: 'loans', element: <MyLoans /> },
  { title: 'Lends', path: 'lends', element: <MyOffers /> },
]

const Dashboard = () => {
  const location = useLocation()
  const { isConnected } = useCurrentWallet()

  if (!isConnected) return <Navigate to={APP_URL.HOME} />

  return (
    <BodyContainer>
      <Flex pt={20} gap={8}>
        <Box className={styles.menuWrapper}>
          <Flex direction='column' gap={2} className={styles.menu}>
            {menus.map(e => {
              const isOverview = e.path === '' && location.pathname === APP_URL.DASHBOARD
              const active = isOverview || e.path === last(location.pathname.split('/'))
              return (
                <Link key={e.title} to={e.path} style={{ textDecoration: 'none' }}>
                  <Button minW={200} variant={active ? 'solid' : 'ghost'} justifyContent='left' borderRadius={8} _hover={{ textDecoration: 'none' }} color={active ? 'text.primary' : 'text.secondary'}>
                    {e.title}
                  </Button>
                </Link>
              )
            })}
          </Flex>
        </Box>
        <Box flex={1}>
          <Routes>
            {menus.map(e => {
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