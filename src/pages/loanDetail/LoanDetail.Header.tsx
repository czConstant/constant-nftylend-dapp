import React from "react";
import { Link } from "react-router-dom";
import SectionCollapse from "src/common/components/sectionCollapse";
import { APP_URL } from "src/common/constants/url";
import ItemNftMedia from "src/modules/nftLend/components/itemNft/itemNftMedia";
import LoanDetailAttr from "./LoanDetail.Attr";
import LoanDetailInfo from "./LoanDetail.Info";

import styles from "./styles.module.scss";
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import LoanDetailPriceInfo from './LoanDetail.PriceInfo';
import LoanDetailInEscrow from './LoanDetail.InEscrow';

export interface LoanDetailProps {
  loan: LoanNft;
  asset: AssetNft;
}

interface LoanDetailHeaderProps extends LoanDetailProps {}

const LoanDetailHeader: React.FC<LoanDetailHeaderProps> = ({ loan, asset }) => {
  return (
    <div className={styles.headerContainer}>
      <div>
        <ItemNftMedia
          detail={asset.detail}
          name={asset.name}
          width={300}
          height={600}
          config={{
            video: {
              controls: true,
              controlsList: "nodownload",
              autoPlay: true,
              onMouseEnter: () => {},
              onMouseLeave: () => {},
            },
          }}
          className={styles.itemMedia}
          showOriginal={true}
        />
      </div>
      <div>
        <h4>
          {asset.name}
          <div className={styles.chain}>{asset.chain}</div>
        </h4>
        <div className={styles.infoAuthor}>
          <Link
            to={`${APP_URL.NFT_LENDING_LIST_LOAN}?collection=${asset.collection?.seo_url}`}
          >
            {asset.collection?.name}
          </Link>
        </div>
        {loan.isOngoing() ? <LoanDetailInEscrow loan={loan} /> : <LoanDetailPriceInfo loan={loan} />}
        <SectionCollapse
          id="detail"
          label="Detail"
          content={<LoanDetailInfo loan={loan} asset={asset} />}
          selected={true}
        />
        <SectionCollapse
          id="attributes"
          label="Attributes"
          content={<LoanDetailAttr asset={asset} />}
        />
        <SectionCollapse
          id="description"
          label="Description"
          content={asset.collection?.description}
        />
      </div>
    </div>
  );
};

export default LoanDetailHeader;
