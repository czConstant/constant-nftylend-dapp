import React, { useEffect, useState } from "react";
import BigNumber from 'bignumber.js';
import { Flex, Grid, GridItem, Icon, Text, Tooltip } from '@chakra-ui/react';

import { formatCurrency } from 'src/common/utils/format';
import BoxAttrValue from 'src/apps/pawn/views/loanDetail/BoxAttrValue';
import InfoTooltip from 'src/common/components/infoTooltip';

interface LoanDetailBorrowerProps {
  data: any;
};

const LoanDetailBorrower: React.FC<LoanDetailBorrowerProps> = ({ data }) => {
  if (!data) return null
  
  const rate = new BigNumber(data?.total_done_loans).dividedBy(data?.total_loans).multipliedBy(100).toNumber();
  let color = 'brand.danger.600'
  if (rate > 50) color = 'brand.warning.600'
  if (rate > 75) color = '#ddc014'
  if (rate > 95) color = 'brand.success.600'
  if (!rate) color ='text.secondary'
  
  return (
    <Grid templateColumns={{ md: '1.5fr 1.5fr 1fr' }} gap={2}>
      <GridItem>
        <Flex direction='column' justifyContent='space-between' h='100%' bgColor='background.darker' borderRadius={16} p={4}>
          <Flex gap={2} alignItems='center'>
            <Text color='text.secondary' fontSize='xl' fontWeight='semibold'>Repayment rate</Text>
            <InfoTooltip label={`The percentage of times a lender has been paid back on the total loans at the end of their terms.`} />
          </Flex>
          <Text fontWeight='bold' fontSize='3xl' color={color}>{rate ? `${formatCurrency(rate)}%` : 'Not Available'}</Text>
        </Flex>
      </GridItem>
      <GridItem>
        <Flex direction='column' justifyContent='space-between' h='100%' bgColor='background.darker' borderRadius={16} p={4}>
          <Flex gap={2} alignItems='center'>
            <Text color='text.secondary' fontSize='xl' fontWeight='semibold'>Credit score</Text>
            <InfoTooltip label={`The primary objective of a credit score is to distinguish between borrowers who repay their loans as "good borrowers" and those who do not as "bad borrowers." The credit score is calculated using the total number of points (0-100). Borrowers  with high scores are frequently low-risk, and vice versa. More information may be found in the NFTPawn Documents.`} />
          </Flex>
          <Text fontWeight='bold' fontSize='3xl' color={color}>{data?.credit_score ? formatCurrency(data?.credit_score) : 'Not Available'}</Text>
        </Flex>
      </GridItem>
      <GridItem>
        <Grid templateColumns={{ md: '1fr' }} gap={2}>
          <GridItem>
            <BoxAttrValue
              label='Total loans'
              value={data?.total_loans}
              desc={`The total amount of the Loans outstanding to each Borrower, and 'Total Loans' means all such loans.`}
            />
          </GridItem>
          <GridItem>
            <BoxAttrValue
              label='Total volume'
              value={`$${formatCurrency(data?.total_volume)}`}
              desc={`Loan Volume refers to the total loan volume originated by an InGridItemidual Hire that has been funded and closed.`}
            />
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

export default LoanDetailBorrower;
