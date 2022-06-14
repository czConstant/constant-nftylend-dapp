import { Box, Button, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import last from 'lodash/last';

import BodyContainer from 'src/common/components/bodyContainer';
import Overview from 'src/views/dashboard/overview';
import MyLoans from 'src/views/dashboard/myLoans';
import MyOffers from 'src/views/dashboard/myOffers';
import MyAssets from 'src/views/dashboard/myAssets';
import { APP_URL } from 'src/common/constants/url';

const menus = [
  { title: 'Overview', path: '', element: <Overview /> },
  { title: 'My NFTs', path: 'nfts', element: <MyAssets /> },
  { title: 'Loans', path: 'loans', element: <MyLoans /> },
  { title: 'Lends', path: 'lends', element: <MyOffers /> },
]

const Dashboard = () => {
  const location = useLocation();

  return (
    <BodyContainer>
      <Flex pt={20} gap={8}>
        <Flex direction='column' gap={2}>
          {menus.map(e => {
            const isOverview = e.path === '' && location.pathname === APP_URL.DASHBOARD
            const active = isOverview || e.path === last(location.pathname.split('/'))
            return (
              <Link to={e.path} style={{ textDecoration: 'none' }}>
                <Button minW={200} variant={active ? 'solid' : 'ghost'} justifyContent='left' borderRadius={8} _hover={{ textDecoration: 'none' }} color={active ? 'text.primary' : 'text.secondary'}>
                  {e.title}
                </Button>
              </Link>
            )
          })}
        </Flex>
        <Box flex={1}>
          <Routes>
            {menus.map(e => {
              return (
                <Route path={e.path} element={e.element} />
              )
            })}
          </Routes>
        </Box>
      </Flex>
    </BodyContainer>
  )
};

export default Dashboard