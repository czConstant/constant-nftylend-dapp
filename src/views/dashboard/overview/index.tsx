import { Box, Divider, Flex, Grid, GridItem, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { formatCurrency } from 'src/common/utils/format';

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
    <Flex direction='column'>
      <Grid w='100%' templateColumns='repeat(4,1fr)'>
        <GridItem>
          <Flex direction='column' m={1} p={4} backgroundColor='background.card' borderRadius={16}>
            <BoxInfo label='Number of Loans' value={5} />
            <Divider mt={4} mb={4} />
            <BoxInfo label='Total Volume' value={34322} />
          </Flex>
        </GridItem>
        <GridItem>
          <Flex direction='column' m={1} p={4} backgroundColor='background.card' borderRadius={16}>
            <BoxInfo label='Number of Lendings' value={8} />
            <Divider mt={4} mb={4} />
            <BoxInfo label='Total Volume' value={1211} />
          </Flex>
        </GridItem>
      </Grid>
      <Tabs variant='enclosed' colorScheme='primary'>
        <TabList p={4}>
          <Tab>Overview</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>

          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default Overview;