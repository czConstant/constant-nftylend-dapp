import React, { useEffect, useState } from "react";
import cx from "classnames";
import BigNumber from 'bignumber.js';
import { Flex, Grid, GridItem, Icon, Text, Tooltip } from '@chakra-ui/react';
import { MdInfoOutline } from 'react-icons/md';

import { AssetNft } from 'src/modules/nftLend/models/nft';
import { getBorrowerStats } from 'src/modules/nftLend/api';
import { formatCurrency } from 'src/common/utils/format';
import BoxAttrValue from 'src/views/loanDetail/BoxAttrValue';
import InfoTooltip from 'src/common/components/infoTooltip';

interface LoanDetailBorrowerProps {
  asset: AssetNft;
  borrower: string;
};

const LoanDetailBorrower: React.FC<LoanDetailBorrowerProps> = ({ asset, borrower }) => {
  const [borrowerStats, setBorrowerStats] = useState<any>(null);
    
  useEffect(() => {
    if (!borrower) return;
    getBorrowerStats(borrower).then(res => {
      setBorrowerStats(res.result)
    });
  }, [borrower])

  const rate = new BigNumber(borrowerStats?.total_done_loans).dividedBy(borrowerStats?.total_loans).multipliedBy(100).toNumber();

  return (
    <Grid templateColumns={{ md: '1.5fr 1fr' }} gap={2}>
      <GridItem>
        <Flex direction='column' justifyContent='space-between' h='100%' bgColor='background.darker' borderRadius={16} p={4}>
          <Flex gap={2} alignItems='center'>
            <Text color='text.secondary' fontSize='xl' fontWeight='semibold'>Repayment rate</Text>
            <InfoTooltip label={`The percentage of times a lender has been paid back on the total loans at the end of their terms.`} />
          </Flex>
          <Text fontWeight='bold' fontSize='3xl'>{rate ? `${formatCurrency(rate)}%` : 'Not Available'}</Text>
        </Flex>
      </GridItem>
      <GridItem>
        <Grid templateColumns={{ md: '1fr' }} gap={2}>
          <GridItem>
            <BoxAttrValue
              label='Total loans'
              value={borrowerStats?.total_loans}
              desc={`The total amount of the Loans outstanding to each Borrower, and 'Total Loans' means all such loans.`}
            />
          </GridItem>
          <GridItem>
            <BoxAttrValue
              label='Total volume'
              value={`$${formatCurrency(borrowerStats?.total_volume)}`}
              desc={`Loan Volume refers to the total loan volume originated by an InGridItemidual Hire that has been funded and closed.`}
            />
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

export default LoanDetailBorrower;
