import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Box, Divider, Flex, Grid, GridItem, Link, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';

import Loading from 'src/common/components/loading';
import { formatCurrency, shortCryptoAddress } from 'src/common/utils/format';
import { getNftListCurrency, getUserStats } from 'src/modules/nftLend/api';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { useToken } from 'src/modules/nftLend/hooks/useToken';
import { Currency } from 'src/modules/nftLend/models/api';

import MyPwp from '../myPwp';
import { getLinkExplorerWallet } from 'src/modules/nftLend/utils';
import { toastSuccess } from 'src/common/services/toaster';
import CopyToClipboard from 'react-copy-to-clipboard';

const Overview = () => {
  const { isConnected, currentWallet } = useCurrentWallet();
  const { getNativeBalance, getBalance } = useToken();

  const [stats, setStats] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    if (isConnected) fetchBalance();
  }, [isConnected]);


  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getUserStats(currentWallet.address, currentWallet.chain);
      setStats(res.result);
    } finally {
      setLoading(false);
    }
  }

  const fetchBalance = async () => {
    const nativeBalance = await getNativeBalance();
    setBalance(nativeBalance);

    const listCurrencies = (await getNftListCurrency(currentWallet.chain)).result;
    const res = await Promise.all(
      listCurrencies.map((e: Currency) =>
        getBalance(e.contract_address)
      )
    );
    listCurrencies.forEach((e: any, i: number) => {
      e.balance = new BigNumber(res[i]).dividedBy(10 ** listCurrencies[i].decimals);
    });
    setCurrencies(listCurrencies);
  };

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
        <GridItem />
        <GridItem>
          <Flex direction='column' p={4} backgroundColor='background.card' borderRadius={16}>
            <Text fontSize='sm' color='text.secondary'>Address</Text>
            <Flex alignItems='center' justifyContent='space-between'>
              <Link fontWeight='medium' target="_blank" href={getLinkExplorerWallet(currentWallet.address, currentWallet.chain)}>
                {shortCryptoAddress(currentWallet.address, 16)}
              </Link>
              <CopyToClipboard
                onCopy={() => toastSuccess("Copied address!")}
                text={currentWallet.address}
              >
                <i className="far fa-copy" />
              </CopyToClipboard>
            </Flex>
            <Divider my={4} />
            <Flex direction='column' fontSize='sm'>
              <Text fontSize='sm' color='text.secondary'>Balance</Text>
              <Flex alignItems='center' justifyContent='space-between'>
                <Text fontWeight='medium'>{formatCurrency(balance, 8)}</Text>
                <Text>{currentWallet.chain.toString()}</Text>
              </Flex>
              {currencies.map((e: Currency) => (
                <Flex key={e.symbol} alignItems='center' justifyContent='space-between'>
                  <Text fontWeight='medium'>{formatCurrency(e.balance, 2)}</Text>
                  <Text>{e.symbol}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
      <Tabs variant='enclosed' defaultIndex={0}>
        <TabList>
          <Tab>Reward</Tab>
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