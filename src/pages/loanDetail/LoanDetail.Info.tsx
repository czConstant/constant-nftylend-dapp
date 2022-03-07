import React, { useMemo } from "react";
import { shortCryptoAddress } from "src/common/utils/format";
import { getLinkSolScanAccount } from "src/common/utils/solana";
import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";

const LoanDetailInfo: React.FC<LoanDetailProps> = ({ loan }) => {
  const details = useMemo(() => {
    let details = [
      {
        label: "Mint address",
        value: `<a target="_blank" href="${getLinkSolScanAccount(
          loan?.contract_address
        )}">${shortCryptoAddress(loan?.contract_address, 8)}</a>`,
      },
      {
        label: "Owner",
        value: `<a target="_blank" href="${getLinkSolScanAccount(
          loan?.new_loan?.owner
        )}">${shortCryptoAddress(loan?.new_loan?.owner, 8)}</a>`,
      },
      {
        label: "Artist Royalties",
        value: `${parseFloat(loan?.seller_fee_rate || 0) * 100}%`,
      },
      {
        label: "Listing/Bidding/Cancel",
        value: "Free",
      },
    ];
    if (!loan?.new_loan) {
      details = details?.splice(1, 1);
    }
    return details;
  }, [loan?.new_loan]);

  return (
    <div className={styles.tabContentWrap}>
      {details.map((v) => (
        <div className={styles.tabContentDetailItem} key={v.label}>
          <div>{v.label}</div>
          <div dangerouslySetInnerHTML={{ __html: v.value }} />
        </div>
      ))}
    </div>
  );
};

export default LoanDetailInfo;
