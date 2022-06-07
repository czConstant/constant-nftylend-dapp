import { Box, Divider, Flex, Grid, GridItem, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { formatCurrency } from 'src/common/utils/format';
import MyPwp from '../myPwp';

const Overview = () => {

  const BoxInfo = ({ label, value }) => {
    return (
      <Box>
        <Text fontSize='sm' color='text.secondary'>{label}</Text>
        <Text fontSize='2xl' fontWeight='bold'>{formatCurrency(value)}</Text>
      </Box>
    )
  }

  return (
    <Flex direction='column' gap={12}>
      <Grid w='100%' templateColumns='repeat(4, 1fr)' gap={4}>
        <GridItem>
          <Flex direction='column' p={4} backgroundColor='background.card' borderRadius={16}>
            <BoxInfo label='Number of Loans' value={5} />
            <Divider mt={4} mb={4} />
            <BoxInfo label='Total Volume' value={34322} />
          </Flex>
        </GridItem>
        <GridItem>
          <Flex direction='column' p={4} backgroundColor='background.card' borderRadius={16}>
            <BoxInfo label='Number of Lendings' value={8} />
            <Divider mt={4} mb={4} />
            <BoxInfo label='Total Volume' value={1211} />
          </Flex>
        </GridItem>
      </Grid>
      <Tabs variant='enclosed' defaultIndex={0}>
        <TabList>
          <Tab>My PWP</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <MyPwp />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default Overview;