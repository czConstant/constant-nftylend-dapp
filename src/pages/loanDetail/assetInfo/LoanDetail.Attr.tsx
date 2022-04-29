import React from "react";
import cx from "classnames";
import { AssetNft, AssetNftAttribute } from 'src/modules/nftLend/models/nft';
import styles from "../styles.module.scss";

interface LoanDetailAttrProps {
  asset: AssetNft;
};

const LoanDetailAttr: React.FC<LoanDetailAttrProps> = ({ asset }) => {
  const attrs: AssetNftAttribute[] = asset.detail?.attributes || [];
  
  return (
    <div className={cx(styles.tabContentWrap, styles.tabContentAttrWrap)}>
      {attrs?.length === 0 ? (
        <div>No Attributes</div>
      ) : (
        attrs?.map((att, i) => (
          <div className={styles.tabContentAttrItem} key={i}>
            <label>{att?.trait_type}</label>
            <div>{att?.value}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default LoanDetailAttr;
