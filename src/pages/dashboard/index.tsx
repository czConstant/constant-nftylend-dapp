import { useState } from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';

import BodyContainer from 'src/common/components/bodyContainer';
import Overview from 'src/views/dashboard/overview';

const tabs = ['overview', 'settings'];

const Dashboard = () => {

  return (
    <BodyContainer>
      <Box pt={20}>
        <Tabs variant='solid-rounded' colorScheme='brand.primary' orientation='vertical' defaultIndex={0}>
          <TabList p={4}>
            <Tab minW={200} justifyContent='left' borderRadius={8}>Overview</Tab>
            <Tab minW={200} justifyContent='left' borderRadius={8}>Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Overview />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </BodyContainer>
  )
};

export default Dashboard