import React, { useEffect, useState } from "react";
import cx from "classnames";
import SectionCollapse from "src/common/components/sectionCollapse";
import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";
import {
  getLoansByAssetId,
  getLoanTransactions,
} from "src/modules/nftLend/api";
import {
  getLinkSolScanAccount,
  getLinkSolScanTx,
} from "src/common/utils/solana";
import {
  formatCurrencyByLocale,
  shortCryptoAddress,
} from "src/common/utils/format";
import moment from "moment-timezone";
import BigNumber from "bignumber.js";
import {
  LOAN_STATUS,
  LOAN_TRANSACTION_ACTIVITY,
} from "src/modules/nftLend/constant";

const TableHeader = () => (
  <div className={cx(styles.tbHeader, styles.activityWrapBody)}>
    <div>txHash</div>
    <div>txType</div>
    <div>Time</div>
    <div>Principal</div>
    <div>Interest</div>
    <div>Duration</div>
    <div>Borrower</div>
    <div>Lender</div>
  </div>
);

const TableBody = ({ results = [], detail }) =>
  results.map((result) => {
    let statusColor = "#ffffff";

    if (["listed"].includes(result.type)) {
      statusColor = "blue";
    } else if (["offered", "repaid"].includes(result.type)) {
      statusColor = "green";
    } else if (["cancelled", "liquidated"].includes(result.type)) {
      statusColor = "red";
    }

    return (
      <div
        className={cx(styles.tbHeader, styles.tbBody, styles.activityWrapBody)}
        key={result?.id}
      >
        <div>
          <a
            className={styles.scanLink}
            target="_blank"
            href={getLinkSolScanTx(result?.tx_hash)}
          >
            {shortCryptoAddress(result?.tx_hash, 8)}
          </a>
        </div>
        <div style={{ color: statusColor }}>
          {LOAN_TRANSACTION_ACTIVITY.find((v) => v.id === result?.type)?.name ||
            "Unknown"}
        </div>
        <div>{moment(result?.created_at).fromNow()}</div>
        <div>{`${formatCurrencyByLocale(
          parseFloat(result?.offer_principal_amount) ||
            parseFloat(result?.principal_amount),
          2
        )} ${result?.loan?.currency?.symbol}`}</div>
        <div>
          {Math.ceil(
            new BigNumber(result.duration).dividedBy(86400).toNumber()
          )}{" "}
          days
        </div>
        <div>
          {new BigNumber(result.interest_rate).multipliedBy(100).toNumber()}%
        </div>
        <div>
          <a
            className={styles.scanLink}
            target="_blank"
            href={getLinkSolScanAccount(result?.borrower)}
          >
            {shortCryptoAddress(result?.borrower, 8)}
          </a>
        </div>
        <div>
          {result?.lender && (
            <a
              className={styles.scanLink}
              target="_blank"
              href={getLinkSolScanAccount(result?.lender)}
            >
              {shortCryptoAddress(result?.lender, 8)}
            </a>
          )}
        </div>
      </div>
    );
  });

const LoanDetailActivity: React.FC<LoanDetailProps> = ({ loan }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (loan?.id) {
      getData();
    }
  }, [loan?.id]);

  const getData = async () => {
    try {
      const response = await getLoanTransactions({
        asset_id: loan?.id?.toString(),
      });
      setResults(response?.result);
    } catch (error) {}
  };

  const renderActivityContent = () => {
    return (
      <>
        <TableHeader />
        <TableBody results={results} detail={loan} />
      </>
    );
  };

  return (
    <SectionCollapse label="Activities" content={renderActivityContent()} />
  );
};

export default LoanDetailActivity;
