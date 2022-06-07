import { Box, Divider, Flex, Grid, GridItem, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Loading from 'src/common/components/loading';
import { formatCurrency } from 'src/common/utils/format';
import { getUserStats } from 'src/modules/nftLend/api';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import MyPwp from '../myPwp';

const Overview = () => {
  const { currentWallet } = useCurrentWallet();
  const [stats, setStats] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getUserStats(currentWallet.address, currentWallet.chain);
      setStats(res.result);
    } finally {
      setLoading(false);
    }
  }

  const BoxInfo = ({ label, value }) => {
    return (
      <Box>
        <Text fontSize='sm' color='text.secondary'>{label}</Text>
        {loading ? <Loading /> : <Text fontSize='2xl' fontWeight='bold'>{value}</Text>}
      </Box>
    )
  }

  return (
    <Flex direction='column' gap={12}>
      <Grid w='100%' templateColumns='repeat(4, 1fr)' gap={4}>
        <GridItem>
          <Flex direction='column' p={4} backgroundColor='background.card' borderRadius={16}>
            <BoxInfo label='Number of Loans' value={formatCurrency(stats?.borrow_stats?.total_loans)} />
            <Divider mt={4} mb={4} />
            <BoxInfo label='Total Volume' value={`$${formatCurrency(stats?.borrow_stats?.total_volume)}`} />
          </Flex>
        </GridItem>
        <GridItem>
          <Flex direction='column' p={4} backgroundColor='background.card' borderRadius={16}>
            <BoxInfo label='Number of Lendings' value={formatCurrency(stats?.lend_stats?.total_loans)} />
            <Divider mt={4} mb={4} />
            <BoxInfo label='Total Volume' value={`$${formatCurrency(stats?.lend_stats?.total_volume)}`} />
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