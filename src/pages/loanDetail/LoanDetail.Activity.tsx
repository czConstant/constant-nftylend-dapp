import React, { useEffect, useState } from "react";
import cx from "classnames";
import sortBy from "lodash/sortBy";
import moment from "moment-timezone";
import BigNumber from "bignumber.js";

import SectionCollapse from "src/common/components/sectionCollapse";
import {
  getSaleTransactions,
  getLoanTransactions,
} from "src/modules/nftLend/api";
import {
  formatCurrencyByLocale,
  shortCryptoAddress,
} from "src/common/utils/format";
import { LOAN_TRANSACTION_ACTIVITY } from "src/modules/nftLend/constant";
import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";
import { AssetActivity, ActivityType } from 'src/modules/nftLend/models/activity';

const TableHeader = () => (
  <div className={cx(styles.tbHeader, styles.activityWrapBody)}>
    <div>txType</div>
    <div>txHash</div>
    <div>Time</div>
    <div>Principal</div>
    <div>Interest</div>
    <div>Duration</div>
    <div>Borrower</div>
    <div>Lender</div>
  </div>
);

const TableBody = ({ results = [] }) => {
  return (<>
    {results.map((result: AssetActivity) => {
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
          className={cx(styles.tbHeader, styles.tbBody, styles.activityWrapBody)}
          key={result?.id}
        >
          <div className={styles.typeWrap}>
            {FilterTypes.find((v) => v.id === result?.type)?.label}
            {result?.status && (
              <span style={{ color: statusColor }}>
                {LOAN_TRANSACTION_ACTIVITY.find((v) => v.id === result?.status)
                  ?.name || "Unknown"}
              </span>
            )}
          </div>
          <div>
            <a
              className={styles.scanLink}
              target="_blank"
              href={result.getLinkExplorerTx()}
            >
              {shortCryptoAddress(result.tx_hash, 8)}
            </a>
          </div>
          <div>{moment(result.created_at).fromNow()}</div>
          <div>
            {result?.principal && `
              ${formatCurrencyByLocale(result.principal, 2)}
              ${' '}
              ${result.loan?.currency?.symbol}
            `}
          </div>
          <div>
            {result.duration &&
              `${Math.ceil(
                new BigNumber(result.duration).dividedBy(86400).toNumber()
              )} days`}
          </div>
          <div>
            {result.interest &&
              `${new BigNumber(result.interest)
                .multipliedBy(100)
                .toNumber()} %APY`}
          </div>
          <div>
            <a
              className={styles.scanLink}
              target="_blank"
              href={result.getLinkExplorerAddr(result.borrower)}
            >
              {shortCryptoAddress(result.borrower, 8)}
            </a>
          </div>
          <div>
            {result.lender && (
              <a
                className={styles.scanLink}
                target="_blank"
                href={result.getLinkExplorerAddr(result.lender)}
                >
                {shortCryptoAddress(result.lender, 8)}
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

const LoanDetailActivity: React.FC<LoanDetailProps> = ({ loan, asset }) => {
  const [sales, setSales] = useState<Array<AssetActivity>>([]);
  const [activities, setActivities] = useState<Array<AssetActivity>>([]);

  useEffect(() => {
    if (loan?.id) {
      fetchLoanTransactions();
      fetchSaleTransactions();
    }
  }, [loan?.id]);

  const fetchLoanTransactions = async () => {
    try {
      const res = await getLoanTransactions({ asset_id: String(asset.id) });
      const _activities: AssetActivity[] = res.result?.map((e: any) => AssetActivity.parseFromApi(e, ActivityType.loan));
      setActivities(_activities);
    } catch (err) {

    }
  };

  const fetchSaleTransactions = async () => {
    try {
      const res = await getSaleTransactions({ asset_id: String(asset.id) });
      const _sales: AssetActivity[] = res.result?.map((e: any) => AssetActivity.parseFromApi(e, ActivityType.sale));
      setSales(_sales);
    } catch (err) {

    }
  };

  const renderActivityContent = () => {
    const _results: AssetActivity[] = sortBy(
      activities?.concat(sales),
      ["created_at"]
    ).reverse();

    return (
      <>
        <TableHeader />
        <TableBody results={_results} />
      </>
    );
  };

  return (
    <SectionCollapse id="activites" label="Activities" content={renderActivityContent()} />
  );
};

export default LoanDetailActivity;
