import React, { useEffect, useState } from "react";
import cx from "classnames";
import { AssetNft } from 'src/modules/nftLend/models/nft';
import styles from "../styles.module.scss";
import { getBorrowerStats } from 'src/modules/nftLend/api';
import { formatCurrency } from 'src/common/utils/format';

interface LoanDetailBorrowerProps {
  asset: AssetNft;
  borrower: string;
};

const LoanDetailBorrower: React.FC<LoanDetailBorrowerProps> = ({ asset, borrower }) => {
  const [borrowerStats, setBorrowerStats] = useState<any>(null);
    
  useEffect(() => {
    if (!borrower) return;
    getBorrowerStats(borrower).then(res => {
      setBorrowerStats(res.result)
    });
  }, [borrower])

  return (
    <div className={cx(styles.tabContentWrap, styles.tabContentAttrWrap)}>
      <div className={styles.tabContentAttrItem}>
        <label>Total Completed</label>
        <div>{borrowerStats?.total_done_loans}</div>
      </div>
      <div className={styles.tabContentAttrItem}>
        <label>Total Loans</label>
        <div>{borrowerStats?.total_loans}</div>
      </div>
      <div className={styles.tabContentAttrItem}>
        <label>Total Volume</label>
        <div>${formatCurrency(borrowerStats?.total_volume)}</div>
      </div>
    </div>
  );
};

export default LoanDetailBorrower;
