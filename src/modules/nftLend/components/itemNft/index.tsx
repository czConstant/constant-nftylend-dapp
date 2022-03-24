import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BigNumber from "bignumber.js";
import { useEffect, useState } from 'react';

import { formatCurrency } from "src/common/utils/format";
import { APP_URL } from "src/common/constants/url";

import styles from "./styles.module.scss";
import ItemNftMedia from "./itemNftMedia";
import { AssetNft } from '../../models/nft';
import { LoanNft } from '../../models/loan';

export const mediaTypes = {
  video: ["mov", "mp4", "video"],
  img: ["jpg", "png", "gif", "jpeg", "image"],
};

export interface ItemNftProps {
  loan?: LoanNft;
  asset: AssetNft;
  onClickItem?: Function;
  onViewLoan?: Function;
  onCancelLoan?: Function;
}

const ItemNFT = (props: ItemNftProps) => {
  const { loan, asset, onClickItem, onViewLoan, onCancelLoan } = props;
  const navigate = useNavigate();
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState(asset.detail);

  if (!asset) return <div className={styles.itemContainer} />;

  useEffect(() => {
    if (asset.needFetchDetail()) getExtraData();
  }, [asset]);

  const getExtraData = async () => {
    setLoadingDetail(true);
    try {
      const res = await asset.fetchDetail();
      setDetail(res);
    } finally {
      setLoadingDetail(false);
    }
  };

  const onView = () => {
    if (onClickItem) return onClickItem(asset);
    if (loan?.seo_url)
      navigate(`${APP_URL.NFT_LENDING_LIST_LOAN}/${loan?.seo_url}`);
  };

  return (
    <div className={styles.itemContainer}>
      <a onClick={onView}>
        <ItemNftMedia
          name={asset.name}
          className={styles.image}
          loading={loadingDetail}
          detail={detail}
        />
        <div className={styles.itemContent}>
          <h5>{asset.name}</h5>
          <div className={styles.infoWrap}>
            <div>{asset.collection?.name}</div>
          </div>
          {loan?.principal_amount && (
            <div className={styles.infoPrice}>
              {formatCurrency(loan.principal_amount)} {loan?.curreny?.symbol}
            </div>
          )}
          <div className={styles.actions}>
            {onViewLoan && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onViewLoan();
                }}
              >
                View Loan
              </Button>
            )}
            {onCancelLoan && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onCancelLoan();
                }}
                className={styles.btnCancel}
              >
                Cancel
              </Button>
            )}
          </div>
          {loan?.interest_rate && loan?.duration && (
            <div className={styles.footer}>
              <div>
                <label>Interest</label>
                <div>
                  {new BigNumber(loan.interest_rate * 100).toPrecision(2)} %APY
                </div>
              </div>
              <div />
              <div>
                <label>Duration</label>
                <div>
                  {new BigNumber(loan.duration / 86400).toNumber()} days
                </div>
              </div>
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default ItemNFT;
