import React, { useEffect, useState } from "react";
import BigNumber from 'bignumber.js';
import NftPawn from '@nftpawn-js/core';
import { Grid, GridItem } from '@chakra-ui/react';

import BoxAttrValue from 'src/views/loanDetail/BoxAttrValue';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { formatCurrency } from 'src/common/utils/format';

interface LoanDetailBorrowerProps {
  asset: AssetNft;
  borrower: string;
};

const LoanDetailBorrower: React.FC<LoanDetailBorrowerProps> = ({ asset, borrower }) => {
  const [borrowerStats, setBorrowerStats] = useState<any>(null);
    
  useEffect(() => {
    if (!borrower) return;
    NftPawn.borrower(borrower).then(res => {
      setBorrowerStats(res.result)
    });
  }, [borrower])

  const rate = new BigNumber(borrowerStats?.total_done_loans).dividedBy(borrowerStats?.total_loans).multipliedBy(100).toNumber();

  return (
    <Grid templateColumns={{ md: 'repeat(3, 1fr)' }} gap={2}>
      <GridItem>
        <BoxAttrValue
          label='Repayment rate'
          value={rate ? `${formatCurrency(rate)}%` : 'Not Available'}
          desc='The percentage of times a lender has been paid back on the total loans at the end of their terms.'
        />
      </GridItem>
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
  );
};

export default LoanDetailBorrower;
