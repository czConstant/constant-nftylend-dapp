import React from "react";
import BigNumber from 'bignumber.js';
import { Grid, GridItem } from '@chakra-ui/react';

import { LoanNft } from 'src/modules/nftLend/models/loan';
import { formatCurrency } from 'src/common/utils/format';
import BoxAttrValue from 'src/views/loanDetail/BoxAttrValue';

interface LoanDetailPriceStatisticProps {
  loan: LoanNft;
};

const LoanDetailPriceStatistic: React.FC<LoanDetailPriceStatisticProps> = ({ loan }) => {
  const usdValue = new BigNumber(loan.asset?.stats?.avg_price).multipliedBy(loan.asset?.stats?.currency?.price);
  const ltv = !usdValue.isEqualTo(0)
    ? new BigNumber(loan.principal_amount).multipliedBy(loan.currency?.price).dividedBy(usdValue).multipliedBy(100).toNumber()
    : 0;

  return (
    <Grid templateColumns={{ md: 'repeat(3, 1fr)' }} gap={2}>
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
      <GridItem>
        <BoxAttrValue
          label='Loan to value'
          value={ltv ? `${formatCurrency(ltv)}%` : 'Not Available'}
          desc={`Lenders use the loan-to-value (LTV) ratio to determine how much risk they're taking on with a secured loan. Any NFTPawn valuation metric is based on estimates and metrics that do not represent financial advice or the actual expected LTV of an NFT listing. Please conduct your own research.`}
        />
      </GridItem>
    </Grid>
  );
};

export default LoanDetailPriceStatistic;
