import React, { useEffect, useState } from "react";
import cx from "classnames";
import moment from "moment-timezone";
import BigNumber from "bignumber.js";
import NftPawn from '@nftpawn-js/core';

import SectionCollapse from "src/common/components/sectionCollapse";
import {
  formatCurrencyByLocale,
  shortCryptoAddress,
} from "src/common/utils/format";
import { LOAN_TRANSACTION_ACTIVITY } from "src/modules/nftLend/constant";
import styles from "./styles.module.scss";
import { AssetLoanHistory } from 'src/modules/nftLend/models/activity';
import { AssetNft } from 'src/modules/nftLend/models/nft';

const TableHeader = () => (
  <div className={cx(styles.tbHeader)}>
    <div style={{ flex: 1 }}>Type</div>
    <div style={{ flex: 1 }}>TX Hash</div>
    <div style={{ flex: 1 }}>Time</div>
    <div style={{ flex: 1 }}>Principal</div>
    <div style={{ flex: 1 }}>Interest</div>
    <div style={{ flex: 1 }}>Duration</div>
    <div style={{ flex: 1 }}>Borrower</div>
    <div style={{ flex: 1 }}>Lender</div>
  </div>
);

const TableBody = ({ results = [] }) => {
  return (<>
    {results.map((result: AssetLoanHistory) => {
      let statusColor = "#ffffff";

      if (["listed"].includes(result.status)) {
        statusColor = "blue";
      } else if (["offered", "repaid"].includes(result.status)) {
        statusColor = "green";
      } else if (["cancelled", "liquidated"].includes(result.status)) {
        statusColor = "red";
      }

      return (
        <div
          className={cx(styles.tbBody)}
          key={result?.id}
        >
          <div style={{ flex: 1 }} className={styles.typeWrap}>
            {FilterTypes.find((v) => v.id === result?.type)?.label}
            {result?.status && (
              <span style={{ color: statusColor }}>
                {LOAN_TRANSACTION_ACTIVITY.find((v) => v.id === result?.status)
                  ?.name || "Unknown"}
              </span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <a
              className={styles.scanLink}
              target="_blank"
              href={result.getLinkExplorerTx()}
            >
              {shortCryptoAddress(result.tx_hash)}
            </a>
          </div>
          <div style={{ flex: 1 }}>{moment(result.created_at).fromNow()}</div>
          <div style={{ flex: 1 }}>
            {result?.principal && `
              ${formatCurrencyByLocale(result.principal)}
              ${' '}
              ${result.loan?.currency?.symbol}
            `}
          </div>
          <div style={{ flex: 1 }}>
            {result.duration &&
              `${Math.ceil(
                new BigNumber(result.duration).dividedBy(86400).toNumber()
              )} days`}
          </div>
          <div style={{ flex: 1 }}>
            {result.interest &&
              `${new BigNumber(result.interest)
                .multipliedBy(100)
                .toNumber()} %APY`}
          </div>
          <div style={{ flex: 1 }}>
            <a
              className={styles.scanLink}
              target="_blank"
              href={result.getLinkExplorerAddr(result.borrower)}
            >
              {shortCryptoAddress(result.borrower)}
            </a>
          </div>
          <div style={{ flex: 1 }}>
            {result.lender && (
              <a
                className={styles.scanLink}
                target="_blank"
                href={result.getLinkExplorerAddr(result.lender)}
                >
                {shortCryptoAddress(result.lender)}
              </a>
            )}
          </div>
        </div>
      );
    })}
  </>)
}

const FilterTypes = [
  {
    id: "sale",
    label: "Sale",
  },
  {
    id: "loan",
    label: "Loan",
  },
];

interface LoanDetailActivityProps {
  asset: AssetNft
}

const LoanDetailActivity: React.FC<LoanDetailActivityProps> = ({ asset }) => {
  const [activities, setActivities] = useState<Array<AssetLoanHistory>>([]);

  useEffect(() => {
    if (asset) {
      fetchLoanTransactions();
    }
  }, [asset]);

  const fetchLoanTransactions = async () => {
    try {
      const res = await NftPawn.loanTransactions({ asset_id: String(asset.id) });
      const _activities: AssetLoanHistory[] = res.result?.map((e: any) => AssetLoanHistory.parseFromApi(e));
      setActivities(_activities);
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
    <SectionCollapse id="loansHistory" label="Loans History" selected content={renderActivityContent()} />
  );
};

export default LoanDetailActivity;
