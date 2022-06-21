import React from "react";
import BigNumber from 'bignumber.js';
import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';

import { LoanNft } from 'src/modules/nftLend/models/loan';
import { formatCurrency } from 'src/common/utils/format';
import BoxAttrValue from 'src/views/loanDetail/BoxAttrValue';
import InfoTooltip from 'src/common/components/infoTooltip';

interface LoanDetailPriceStatisticProps {
  loan: LoanNft;
};

const LoanDetailPriceStatistic: React.FC<LoanDetailPriceStatisticProps> = ({ loan }) => {
  const principalUsdValue = new BigNumber(loan.principal_amount).multipliedBy(loan.currency?.price);
  const avgUsdValue = new BigNumber(loan.asset?.stats?.avg_price).multipliedBy(loan.asset?.stats?.currency?.price);
  const floorUsdValue = new BigNumber(loan.asset?.stats?.floor_price).multipliedBy(loan.asset?.stats?.currency?.price);
  const ltv = avgUsdValue.isGreaterThan(0)
    ? principalUsdValue.dividedBy(avgUsdValue).multipliedBy(100).toNumber()
    : floorUsdValue.isGreaterThan(0)
      ? principalUsdValue.dividedBy(floorUsdValue).multipliedBy(100).toNumber()
      : 0

  return (
    <Grid templateColumns={{ md: '1.5fr 1fr' }} gap={2}>
      <GridItem>
        <Flex direction='column' justifyContent='space-between' h='100%' bgColor='background.darker' borderRadius={16} p={4}>
          <Flex gap={2} alignItems='center'>
            <Text color='text.secondary' fontSize='xl' fontWeight='semibold'>Loan to value</Text>
            <InfoTooltip label={`Lenders use the loan-to-value (LTV) ratio to determine how much risk they're taking on with a secured loan. Any NFTPawn valuation metric is based on estimates and metrics that do not represent financial advice or the actual expected LTV of an NFT listing. Please conduct your own research.`} />
          </Flex>
          <Text fontWeight='bold' fontSize='3xl'>{ltv ? `${formatCurrency(ltv)}%` : 'Not Available'}</Text>
        </Flex>
      </GridItem>
      <GridItem>
        <Grid templateColumns={{ md: '1fr' }} gap={2}>
          <GridItem>
            <BoxAttrValue
              label='Avg Price'
              value={`${formatCurrency(loan.asset?.stats?.avg_price)} ${loan.asset?.stats?.currency?.symbol}`}
              desc='The average price is a representative measure of a range of prices. It is calculated by taking the sum of NFT values and dividing it by the number of NFT listied.'
            />
          </GridItem>
          <GridItem>
            <BoxAttrValue
              label='Floor Price'
              value={`${formatCurrency(loan.asset?.stats?.floor_price)} ${loan.asset?.stats?.currency?.symbol}`}
              desc={`The floor price is the lowest 'Buy Now' price for an NFT within a collection`}
            />
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

export default LoanDetailPriceStatistic;
