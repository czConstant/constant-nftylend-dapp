import React from "react";
import cx from "classnames";
import { AssetNft } from 'src/modules/nftLend/models/nft';
import styles from "../styles.module.scss";

interface LoanDetailPriceStatisticProps {
  asset: AssetNft;
};

const LoanDetailPriceStatistic: React.FC<LoanDetailPriceStatisticProps> = ({ asset }) => {
  return (
    <div className={cx(styles.tabContentWrap, styles.tabContentAttrWrap)}>
      <div className={styles.tabContentAttrItem}>
        <label>Avg Price</label>
        <div>{asset.stats?.avg_price} {asset.stats?.currency.symbol}</div>
      </div>
      <div className={styles.tabContentAttrItem}>
        <label>Floor Price</label>
        <div>{asset.stats?.floor_price} {asset.stats?.currency.symbol}</div>
      </div>
    </div>
  );
};

export default LoanDetailPriceStatistic;
