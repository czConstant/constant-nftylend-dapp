import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import cx from 'classnames'

import { formatCurrency } from "src/common/utils/format";
import { APP_URL } from "src/common/constants/url";

import styles from "./styles.module.scss";
import ItemNftMedia from "./itemNftMedia";
import { AssetNft } from '../../models/nft';
import { LoanNft } from '../../models/loan';
import { LOAN_DURATION } from '../../constant';

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
  className?: string;
}

const ItemNFT = (props: ItemNftProps) => {
  const { loan, asset, onClickItem, onViewLoan, onCancelLoan, className } = props;
  const navigate = useNavigate();
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState(asset?.detail);

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

  const loanDuration = LOAN_DURATION.find(e => e.id === loan?.duration / 86400);

  return (
    <div className={cx(className, styles.itemContainer)}>
      <a onClick={onView}>
        <ItemNftMedia
          name={asset.name}
          className={styles.image}
          loading={loadingDetail}
          detail={detail}
        />
        <div className={styles.itemContent}>
          <div className={styles.infoWrap}>
            <div>
              <h5>{asset.name}</h5>
              <div>{asset.collection?.name}</div>
            </div>
            <div className={styles.chain}>{asset.chain}</div>
          </div>
          {loan?.principal_amount && (
            <div className={styles.infoPrice}>
              {formatCurrency(loan.principal_amount)} {loan?.currency?.symbol}
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
                  {formatCurrency(new BigNumber(loan.interest_rate).multipliedBy(100).toNumber(), 2)} %APY
                </div>
              </div>
              <div />
              <div>
                <label>Duration</label>
                <div>
                  {loanDuration ? loanDuration.label : `${Math.ceil(new BigNumber(loan?.duration).dividedBy(86400).toNumber())} days`}
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
