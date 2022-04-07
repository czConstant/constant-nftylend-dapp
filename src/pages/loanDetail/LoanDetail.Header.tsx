import BigNumber from "bignumber.js";
import React from "react";
import { Link } from "react-router-dom";
import SectionCollapse from "src/common/components/sectionCollapse";
import { APP_URL } from "src/common/constants/url";
import { formatCurrencyByLocale } from "src/common/utils/format";
import ItemNftMedia from "src/modules/nftLend/components/itemNft/itemNftMedia";
import LoanDetailAttr from "./LoanDetail.Attr";
import LoanDetailInfo from "./LoanDetail.Info";
import icPriceTag from "./assets/ic_price_tag.svg";

import styles from "./styles.module.scss";
import LoanDetailButtons from "./LoanDetail.Buttons";
import { OfferData } from 'src/modules/nftLend/models/api';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { isSameAddress } from 'src/common/utils/helper';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { LOAN_DURATION } from 'src/modules/nftLend/constant';

export interface LoanDetailProps {
  loan: LoanNft;
  asset: AssetNft;
}

interface LoanDetailHeaderProps extends LoanDetailProps {}

const LoanDetailHeader: React.FC<LoanDetailHeaderProps> = ({ loan, asset }) => {
  const { currentWallet } = useCurrentWallet();
  const userOffer: OfferData = loan.offers?.find(
    (v) =>
      isSameAddress(v.lender?.toString(), currentWallet.address) &&
      v.status === "new"
  );

  const loanDuration = LOAN_DURATION.find(e => e.id === loan.duration / 86400);
  const offerDuration = LOAN_DURATION.find(e => e.id === userOffer?.duration / 86400);

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
        {loan.currency && (
          <div className={styles.infoPrice}>
            <div className={styles.infoPriceTags}>
              <label>Item Price</label>
              <img src={icPriceTag} alt="item price" />
            </div>
            <div className={styles.infoPriceValue}>
              <div>{`${formatCurrencyByLocale(
                loan.principal_amount,
                2
              )} ${loan.currency?.symbol}`}</div>
            </div>
            <LoanDetailButtons loan={loan} userOffer={userOffer} />
            <div className={styles.feeInfoWrap}>
              <div>
                <div className={styles.feeInfoTitle}>Interest rate</div>
                <div className={styles.feeInfoValue}>
                  {new BigNumber(loan.interest_rate)
                    .multipliedBy(100)
                    .toNumber()}
                  %
                </div>
              </div>
              <div>
                <div className={styles.feeInfoTitle}>Terms</div>
                <div className={styles.feeInfoValue}>
                  {loanDuration ? loanDuration.label : `${Math.ceil(new BigNumber(loan.duration).dividedBy(86400).toNumber())} days`}
                </div>
              </div>
              {userOffer && (
                <>
                  <div>
                    <div
                      className={styles.feeInfoTitle}
                      style={{ color: "green", opacity: 0.8 }}
                    >
                      My Principal
                    </div>
                    <div
                      className={styles.feeInfoValue}
                      style={{ color: "green", fontWeight: "bold" }}
                    >
                      {userOffer?.principal_amount} {loan.currency?.symbol}
                    </div>
                  </div>
                  <div>
                    <div
                      className={styles.feeInfoTitle}
                      style={{ color: "green", opacity: 0.8 }}
                    >
                      My Interest rate
                    </div>
                    <div
                      className={styles.feeInfoValue}
                      style={{ color: "green", fontWeight: "bold" }}
                    >
                      {new BigNumber(userOffer?.interest_rate)
                        .multipliedBy(100)
                        .toNumber()}
                      %
                    </div>
                  </div>
                  <div>
                    <div
                      className={styles.feeInfoTitle}
                      style={{ color: "green", opacity: 0.8 }}
                    >
                      My Terms
                    </div>
                    <div
                      className={styles.feeInfoValue}
                      style={{ color: "green", fontWeight: "bold" }}
                    >
                      {offerDuration ? offerDuration.label : `${Math.ceil(new BigNumber(userOffer.duration).dividedBy(86400).toNumber())} days`}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
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
