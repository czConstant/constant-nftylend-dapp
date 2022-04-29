import React from "react";
import { Link } from "react-router-dom";

import SectionCollapse from "src/common/components/sectionCollapse";
import { APP_URL } from "src/common/constants/url";
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { OfferData } from 'src/modules/nftLend/models/api';

import LoanDetailPriceInfo from './LoanDetail.PriceInfo';
import LoanDetailInEscrow from './LoanDetail.InEscrow';
import LoanDetailBorrower from './LoanDetail.Borrower';
import LoanDetailOffers from './LoanDetail.Offers';
import LoanDetailPriceStatistic from './LoanDetail.PriceStatistic';
import styles from "../styles.module.scss";

export interface LoanDetailPawnIfoProps {
  loan: LoanNft;
  userOffer?: OfferData;
}

const LoanDetailPawnIfo: React.FC<LoanDetailPawnIfoProps> = ({ loan }) => {
  if (!loan.asset) return null;

  return (
    <div>
      <h4>
        {loan.asset.name}
        <div className={styles.chain}>{loan.asset.chain}</div>
      </h4>
      <div className={styles.infoAuthor}>
        <Link
          to={`${APP_URL.NFT_LENDING_LIST_LOAN}?collection=${loan.asset.collection?.seo_url}`}
        >
          {loan.asset.collection?.name}
        </Link>
      </div>
      {(loan.isEmpty() || loan.isDone()) ? null : loan.isOngoing() ? <LoanDetailInEscrow loan={loan} /> : <LoanDetailPriceInfo loan={loan} />}
      <SectionCollapse
        id="priceStats"
        label="Price Statistic"
        selected
        content={<LoanDetailPriceStatistic asset={loan.asset} />}
      />
      <SectionCollapse
        id="borrowerStats"
        label="About This Borrower"
        selected
        content={<LoanDetailBorrower asset={loan.asset} borrower={loan.owner} />}
      />
      <SectionCollapse
        id="offers"
        label="Offers"
        selected
        content={<LoanDetailOffers loan={loan} />}
      />
    </div>
  );
};

export default LoanDetailPawnIfo;
