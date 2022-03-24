import React, { useMemo } from "react";
import { shortCryptoAddress } from "src/common/utils/format";
import {
  getLinkETHScanAddress,
  getLinkETHScanTokenId,
  getLinkSolScanAccount,
} from "src/modules/solana/utils";
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
    ];
    if (!loan?.new_loan) {
      details = details?.splice(1, 1);
    }
    if (loan?.origin_contract_address) {
      details.push(
        {
          label: "Original Contract Address",
          value: `<a target="_blank" href="${getLinkETHScanAddress(
            loan?.origin_contract_address
          )}">${shortCryptoAddress(loan?.origin_contract_address, 8)}</a>`,
        },
        {
          label: "Original Network",
          value: `${loan?.origin_network}`,
        },
        {
          label: "Original Contract Id",
          value: `<a target="_blank" href="${getLinkETHScanTokenId(
            loan?.origin_contract_address,
            loan?.origin_token_id
          )}">${loan?.origin_token_id}</a>`,
        }
      );
    }
    details.push(
      {
        label: "Artist Royalties",
        value: `${parseFloat(loan?.seller_fee_rate || 0) * 100}%`,
      },
      {
        label: "Listing/Bidding/Cancel",
        value: "Free",
      }
    );
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
