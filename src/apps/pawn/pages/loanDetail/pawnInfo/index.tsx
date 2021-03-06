import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flex, Text } from '@chakra-ui/react';

import SectionCollapse from "src/common/components/sectionCollapse";
import { APP_URL } from "src/common/constants/url";
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { OfferData } from 'src/modules/nftLend/models/api';
import CountdownText from 'src/common/components/countdownText';
import { getBorrowerStats } from 'src/modules/nftLend/api';

import LoanDetailPriceInfo from './LoanDetail.PriceInfo';
import LoanDetailInEscrow from './LoanDetail.InEscrow';
import LoanDetailBorrower from './LoanDetail.Borrower';
import LoanDetailPriceStatistic from './LoanDetail.PriceStatistic';
import styles from "../styles.module.scss";

export interface LoanDetailPawnInfoProps {
  loan: LoanNft;
  userOffer?: OfferData;
}

const LoanDetailPawnInfo: React.FC<LoanDetailPawnInfoProps> = ({ loan }) => {

  const [borrowerStats, setBorrowerStats] = useState<any>(null);
    
  useEffect(() => {
    if (!loan.owner) return;
    getBorrowerStats(loan.owner, loan.chain).then(res => {
      setBorrowerStats(res.result)
    });
  }, [loan])

  if (!loan.asset) return null;
  const havePriceStats = !!Number(loan.asset?.stats?.avg_price) && !!Number(loan.asset?.stats?.floor_price)

  return (
    <Flex direction='column' gap={2}>
      <h4>
        {loan.asset.name}
        <div className={styles.chain}>{loan.asset.chain}</div>
      </h4>
      <Flex alignItems='center' justifyContent='space-between'>
        <Link to={`${APP_URL.LIST_LOAN}?collection=${loan.asset.collection?.seo_url}`}>
          <Text fontSize='xs' fontWeight='medium'>{loan.asset.collection?.name}</Text>
        </Link>
        {loan.isListing() && (
          <div>
            <CountdownText label='Ends in' to={loan.valid_at} />
          </div>
        )}
      </Flex>
      {loan.isOngoing()
        ? <LoanDetailInEscrow loan={loan} />
        : loan.isListing() ? <LoanDetailPriceInfo loan={loan} /> : null}
      {havePriceStats && (
        <SectionCollapse
          id="priceStats"
          label="Price Info"
          selected
          content={<LoanDetailPriceStatistic loan={loan} />}
        />
      )}
      {borrowerStats?.total_loans > 0 && (
        <SectionCollapse
          id="borrowerStats"
          label="Borrower Info"
          selected
          content={<LoanDetailBorrower data={borrowerStats} />}
        />
      )}
    </Flex>
  );
};

export default LoanDetailPawnInfo;
