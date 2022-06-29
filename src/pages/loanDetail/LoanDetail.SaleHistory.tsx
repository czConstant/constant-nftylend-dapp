import React, { useEffect, useState } from "react";
import cx from "classnames";
import NftPawn from '@nftpawn-js/core';

import SectionCollapse from "src/common/components/sectionCollapse";
import { formatCurrency, formatDateTime, shortCryptoAddress } from "src/common/utils/format";
import { AssetSaleHistory } from 'src/modules/nftLend/models/activity';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import styles from "./styles.module.scss";

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
          <div style={{ flex: 1 }}>{formatDateTime(result.transaction_at)}</div>
          <div style={{ flex: 1 }}>{formatCurrency(result.amount)} {result.currency?.symbol}</div>
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

interface LoanDetailSaleHistoryProps {
  asset: AssetNft;
}

const LoanDetailSaleHistory: React.FC<LoanDetailSaleHistoryProps> = ({ asset }) => {
  const [activities, setActivities] = useState<Array<AssetSaleHistory>>([]);

  useEffect(() => {
    if (asset?.id) {
      fetchSaleTransactions();
    }
  }, [asset]);

  const fetchSaleTransactions = async () => {
    try {
      const res = await NftPawn.assetTransactions({ asset_id: String(asset.id) });
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
