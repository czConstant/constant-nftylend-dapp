import React, { useEffect, useState } from "react";
import cx from "classnames";
import { AssetNft } from 'src/modules/nftLend/models/nft';
import styles from "../styles.module.scss";
import { getBorrowerStats } from 'src/modules/nftLend/api';
import { formatCurrency } from 'src/common/utils/format';
import BigNumber from 'bignumber.js';

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

  const rate = new BigNumber(borrowerStats?.total_done_loans).dividedBy(borrowerStats?.total_loans).multipliedBy(100).toNumber();

  return (
    <div className={cx(styles.tabContentWrap, styles.tabContentAttrWrap)}>
      <div className={styles.tabContentAttrItem}>
        <label>Repaid Rate</label>
        <div>{formatCurrency(rate)}%</div>
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
