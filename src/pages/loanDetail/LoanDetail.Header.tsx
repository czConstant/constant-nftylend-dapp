import BigNumber from "bignumber.js";
import React from "react";
import { Link } from "react-router-dom";
import SectionCollapse from "src/common/components/sectionCollapse";
import { APP_URL } from "src/common/constants/url";
import { formatCurrencyByLocale } from "src/common/utils/format";
import ItemNftMedia from "src/modules/nftLend/components/itemNft/itemNftMedia";
import { LoanDataDetail } from "src/modules/nftLend/models/loan";
import LoanDetailAttr from "./LoanDetail.Attr";
import LoanDetailInfo from "./LoanDetail.Info";
import icPriceTag from "./assets/ic_price_tag.svg";

import styles from "./styles.module.scss";
import LoanDetailButtons from "./LoanDetail.Buttons";
import LoanDetailOffers from "./LoanDetail.Offers";

export interface LoanDetailProps {
  loan?: LoanDataDetail;
}

interface LoanDetailHeaderProps extends LoanDetailProps {}

const LoanDetailHeader: React.FC<LoanDetailHeaderProps> = ({ loan }) => {
  return (
    <div className={styles.headerContainer}>
      <div>
        <ItemNftMedia
          tokenUrl={loan?.token_url}
          name={loan?.name}
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
        <h4>{loan?.name}</h4>
        <div className={styles.infoAuthor}>
          <Link
            to={`${APP_URL.NFT_LENDING_LIST_LOAN}?collection_slug=${loan?.collection?.seo_url}`}
          >
            {loan?.collection?.name}
          </Link>
        </div>
        {loan?.new_loan && (
          <div className={styles.infoPrice}>
            <div className={styles.infoPriceTags}>
              <label>Item Price</label>
              <img src={icPriceTag} alt="item price" />
            </div>
            <div className={styles.infoPriceValue}>
              <div>{`${formatCurrencyByLocale(
                loan?.new_loan?.principal_amount,
                2
              )} ${loan?.new_loan?.currency?.symbol}`}</div>
            </div>
            <LoanDetailButtons loan={loan} reload={() => null} />
            <div className={styles.feeInfoWrap}>
              <div>
                <div className={styles.feeInfoTitle}>Interest rate</div>
                <div className={styles.feeInfoValue}>
                  {new BigNumber(loan?.new_loan?.interest_rate)
                    .multipliedBy(100)
                    .toNumber()}
                  %
                </div>
              </div>
              <div>
                <div className={styles.feeInfoTitle}>Terms</div>
                <div className={styles.feeInfoValue}>
                  {new BigNumber(loan?.new_loan?.duration)
                    .dividedBy(86400)
                    .toNumber()}{" "}
                  Days
                </div>
              </div>
            </div>
          </div>
        )}
        <SectionCollapse
          label="Detail"
          content={<LoanDetailInfo loan={loan} />}
          selected={true}
        />
        <SectionCollapse
          label="Attributes"
          content={<LoanDetailAttr loan={loan} />}
        />
        <SectionCollapse
          label="Description"
          content={loan?.collection?.description}
        />
      </div>
    </div>
  );
};

export default LoanDetailHeader;
