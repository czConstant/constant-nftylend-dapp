import React from "react";
import cx from "classnames";
import BigNumber from 'bignumber.js';

import { LoanNft } from 'src/modules/nftLend/models/loan';
import { formatCurrency } from 'src/common/utils/format';

import styles from "../styles.module.scss";

interface LoanDetailPriceStatisticProps {
  loan: LoanNft;
};

const LoanDetailPriceStatistic: React.FC<LoanDetailPriceStatisticProps> = ({ loan }) => {
  const usdValue = new BigNumber(loan.asset?.stats?.avg_price).multipliedBy(loan.asset?.stats?.currency?.price);
  const ltv = !usdValue.isEqualTo(0)
    ? new BigNumber(loan.principal_amount).dividedBy(usdValue).multipliedBy(100).toNumber()
    : 0;

  return (
    <div className={cx(styles.tabContentWrap, styles.tabContentAttrWrap)}>
      <div className={styles.tabContentAttrItem}>
        <label>Avg Price</label>
        <div>{formatCurrency(loan.asset?.stats?.avg_price)} {loan.asset?.stats?.currency?.symbol}</div>
      </div>
      <div className={styles.tabContentAttrItem}>
        <label>Floor Price</label>
        <div>{formatCurrency(loan.asset?.stats?.floor_price)} {loan.asset?.stats?.currency?.symbol}</div>
      </div>
      <div className={styles.tabContentAttrItem}>
        <label>Loan To Value</label>
        <div>{ltv ? `${formatCurrency(ltv)}%` : 'Not Available'}</div>
      </div>
    </div>
  );
};

export default LoanDetailPriceStatistic;
