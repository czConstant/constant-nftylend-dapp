import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import BodyContainer from 'src/common/components/bodyContainer';
import Overview from 'src/views/dashboard/overview';
import MyLoans from 'src/views/dashboard/myLoans';
import MyOffers from 'src/views/dashboard/myOffers';
import MyAssets from 'src/views/dashboard/myAssets';

const Dashboard = () => {

  return (
    <BodyContainer>
      <Box pt={20}>
        <Tabs variant='solid-rounded' colorScheme='brand.primary' orientation='vertical' defaultIndex={0}>
          <TabList p={4}>
            <Tab minW={200} justifyContent='left' borderRadius={8}>Overview</Tab>
            <Tab minW={200} justifyContent='left' borderRadius={8}>My NFTs</Tab>
            <Tab minW={200} justifyContent='left' borderRadius={8}>Loans</Tab>
            <Tab minW={200} justifyContent='left' borderRadius={8}>Lends</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Overview />
            </TabPanel>
            <TabPanel>
              <MyAssets />
            </TabPanel>
            <TabPanel>
              <MyLoans />
            </TabPanel>
            <TabPanel>
              <MyOffers />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </BodyContainer>
  )
};

export default Dashboard