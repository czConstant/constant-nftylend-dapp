import React from "react";
import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";
import cx from "classnames";
import { LoanDataAttributes } from "src/modules/nftLend/models/loan";

const LoanDetailAttr: React.FC<LoanDetailProps> = ({ loan }) => {
  const attrs: LoanDataAttributes[] = loan?.attributes || [];
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
