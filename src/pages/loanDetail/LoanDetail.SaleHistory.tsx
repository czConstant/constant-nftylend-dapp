import React, { useEffect, useState } from "react";
import cx from "classnames";
import sortBy from "lodash/sortBy";
import moment from "moment-timezone";
import BigNumber from "bignumber.js";

import SectionCollapse from "src/common/components/sectionCollapse";
import {
  getSaleTransactions,
} from "src/modules/nftLend/api";
import {
  formatCurrencyByLocale,
  shortCryptoAddress,
} from "src/common/utils/format";
import { LOAN_TRANSACTION_ACTIVITY } from "src/modules/nftLend/constant";
import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";
import { AssetSaleHistory } from 'src/modules/nftLend/models/activity';

const TableHeader = () => (
  <div className={cx(styles.tbHeader, styles.activityWrapBody)}>
    <div style={{ flex: 1 }}>txHash</div>
    <div style={{ flex: 1 }}>Time</div>
    <div style={{ flex: 1 }}>Amount</div>
    <div style={{ flex: 1 }}>Seller</div>
    <div style={{ flex: 1 }}>Buyer</div>
    <div style={{ flex: 1 }}>Source</div>
  </div>
);

const TableBody = ({ results = [] }) => {
  return (<>
    {results.map((result: AssetSaleHistory) => {
      return (
        <div
          className={cx(styles.tbHeader, styles.tbBody)}
          key={result?.id}
        >
          <div style={{ flex: 1 }}>
            <a
              className={styles.scanLink}
              target="_blank"
              href={result.getLinkExplorerTx()}
            >
              {shortCryptoAddress(result.tx_hash)}
            </a>
          </div>
          <div style={{ flex: 1 }}>{moment(result.transaction_at).format('YYYY-MM-DD HH:mm')}</div>
          <div style={{ flex: 1 }}>{formatCurrencyByLocale(result.amount, 2)} {result.currency?.symbol}</div>
          <div style={{ flex: 1 }}>
            <a
              className={styles.scanLink}
              target="_blank"
              href={result.getLinkExplorerAddr(result.seller)}
            >
              {shortCryptoAddress(result.seller)}
            </a>
          </div>
          <div style={{ flex: 1 }}>
            <a
              className={styles.scanLink}
              target="_blank"
              href={result.getLinkExplorerAddr(result.buyer)}
            >
              {shortCryptoAddress(result.buyer)}
            </a>
          </div>
          <div style={{ flex: 1 }}>{result.source}</div>
        </div>
      );
    })}
  </>)
}

const LoanDetailSaleHistory: React.FC<LoanDetailProps> = ({ loan, asset }) => {
  const [activities, setActivities] = useState<Array<AssetSaleHistory>>([]);

  useEffect(() => {
    if (loan?.id) {
      fetchSaleTransactions();
    }
  }, [loan?.id]);

  const fetchSaleTransactions = async () => {
    try {
      const res = await getSaleTransactions({ asset_id: String(asset.id) });
      const _sales: AssetSaleHistory[] = res.result?.map((e: any) => AssetSaleHistory.parseFromApi(e));
      setActivities(_sales);
    } catch (err) {

    }
  };

  const renderActivityContent = () => {
    return (
      <>
        <TableHeader />
        <TableBody results={activities} />
      </>
    );
  };

  return (
    <SectionCollapse id="salesHistory" label="Sales History" content={renderActivityContent()} />
  );
};

export default LoanDetailSaleHistory;
