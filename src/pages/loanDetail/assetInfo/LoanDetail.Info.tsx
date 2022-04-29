import React, { useMemo } from "react";
import { shortCryptoAddress } from "src/common/utils/format";
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { getLinkETHScanAddress, getLinkETHScanTokenId } from "src/modules/solana/utils";
import styles from "../styles.module.scss";

interface LoanDetailAssetInfoProps {
  asset: AssetNft;
  borrower: string;
}

const LoanDetailInfo: React.FC<LoanDetailAssetInfoProps> = ({ asset, borrower }) => {
  const details = useMemo(() => {
    let details = [
      {
        label: "Mint address",
        value: `<a target="_blank" href="${asset.getLinkExplorer()}">${shortCryptoAddress(asset.contract_address)}</a>`,
      },
      {
        label: "Owner",
        value: `<a target="_blank" href="${asset.getLinkExplorer(borrower)}">${shortCryptoAddress(borrower)}</a>`,
      },
    ];
    if (asset.origin_contract_address) {
      details.push(
        {
          label: "Original Contract Address",
          value: `<a target="_blank" href="${getLinkETHScanAddress(
            asset.origin_contract_address
          )}">${shortCryptoAddress(asset.origin_contract_address)}</a>`,
        },
        {
          label: "Original Network",
          value: `${asset.origin_contract_network}`,
        },
        {
          label: "Original Contract Id",
          value: `<a target="_blank" href="${getLinkETHScanTokenId(
            asset.origin_contract_address,
            asset.origin_token_id
          )}">${asset.origin_token_id}</a>`,
        }
      );
    }
    details.push(
      {
        label: "Artist Royalties",
        value: `${(asset.detail?.seller_fee_rate || 0) * 100}%`,
      },
      {
        label: "Listing/Bidding/Cancel",
        value: "Free",
      }
    );
    return details;
  }, [asset]);

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
