import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Button, Dropdown } from 'react-bootstrap';

import styles from './styles.module.scss';
import ItemNftMedia from '../itemNft/itemNftMedia';
import { APP_URL } from 'src/common/constants/url';
import { getAssetInfo, verifyAsset } from '../../api';
import Loading from 'src/common/components/loading';
import { isMobile } from 'react-device-detect';
import { AssetNft } from '../../models/nft';
import { LoanNft } from '../../models/loan';

interface AssetDetailModalProps {
  asset: AssetNft;
  onClose: Function;
  navigate: Function;
  onMakeLoan?: Function;
};

const AssetDetailModal = (props: AssetDetailModalProps) => {
  const { asset, navigate, onClose, onMakeLoan } = props;

  const [extraData, setExtraData] = useState(asset.detail || {});
  const [listingDetail, setListingDetail] = useState({} as any);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [loan, setLoan] = useState<LoanNft>();

  useEffect(() => {
    if (asset.needFetchDetail()) getExtraData();
    verifiedCollection();
    checkLoanInfo();
  }, [asset]);

  const verifiedCollection = async () => {
    try {
      setVerifying(true);
      const response = await verifyAsset(String(asset.id));
      setListingDetail(response.result);
    } catch (error) {
    } finally {
      setVerifying(false);
    }
  };

  const checkLoanInfo = async () => {
    try {
      setVerifying(true);
      const res = await getAssetInfo(asset.contract_address, asset.token_id);
      const loan = LoanNft.parseFromApiDetail(res.result);
      setLoan(loan);
    } catch (error) {
    } finally {
      setVerifying(false);
    }
  };

  const getExtraData = async () => {
    setLoading(true);
    try {
      const res = await asset.fetchDetail();
      setExtraData(res);
    } finally {
      setLoading(false);
    }
  };

  const onClickMakeLoan = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    if (onMakeLoan) onMakeLoan();
  }

  const onGoTtoLoan = () => {
    onClose();
    navigate(`${APP_URL.NFT_LENDING_LIST_LOAN}/${loan?.seo_url}`);
  };

  const onClickVerify = () => {
    onClose();
    const name = extraData?.collection?.name;
    const author = extraData?.properties?.creators[0]?.address;
    navigate(`${APP_URL.NFT_LENDING_SUBMIT_WHITELIST}?collection=${name}&creator=${author}`);
  };

  const renderButton = () => {
    if (verifying) return <Loading />;
    if (loan?.isListing()) return (
      <Button onClick={onGoTtoLoan} className={styles.btnConnect}>
        Go to loan
      </Button>
    );
    if (listingDetail) return (
      <Button onClick={onClickMakeLoan} className={styles.btnConnect}>
        Make a Loan
      </Button>
    );
    return (
      <div className={styles.notVerified}>
        Assets on NFT Pawn are required verification by us to use as collateral. Please <a onClick={onClickVerify}>submit verification form</a> for this collection.
      </div>
    );
  };

  return (
    <div className={cx(isMobile && styles.moAssetDetailModal, styles.assetDetailModal)}>
      {
        isMobile &&
          <a onClick={onClose} className={styles.btnClose} >
            <i className="fas fa-times"></i>
          </a>
      }
      <ItemNftMedia
        name={asset.name}
        className={cx(extraData?.attributes?.length > 6 && styles.largeImage)}
        detail={extraData}
        loading={loading}
      />
      <div>
        <h4>{asset.name}</h4>
        <div>
          <a
            className={styles.infoAuthor}
            target="_blank"
            href={`${
              APP_URL.NFT_LENDING_LIST_LOAN
            }?collection=${extraData?.collection?.family?.toLowerCase()}`}
          >
            {extraData?.collection?.name}
          </a>
        </div>
        {asset.creator && (
          <div>
            <a
              className={styles.infoCreator}
              target="_blank"
              href={asset.getLinkExplorer(asset.creator)}
            >
              Creators
            </a>{' '}
            ·{' '}
            <a
              target="_blank"
              href={asset.getLinkExplorer(asset.owner)}
            >
              Authority
            </a>
          </div>
        )}
        <div className={cx(styles.actions)}>
          {renderButton()}
          <Dropdown align={'end'} className={styles.dropdown}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <i className="far fa-ellipsis-v"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                target="_blank"
                href={asset.getLinkExplorer()}
              >
                View in explorer
              </Dropdown.Item>
              <Dropdown.Item target="_blank" href={asset.detail_uri}>
                View raw JSON
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className={styles.description}>{extraData?.description}</div>
        {extraData?.attributes?.length > 0 && (
          <div className={styles.attContainer}>
            {/* <label>Attributes</label> */}
            <div className={styles.attWrap}>
              {extraData?.attributes?.map((att: any) => (
                <div key={att?.trait_type}>
                  <label>{att?.trait_type}</label>
                  <div>{att?.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AssetDetailModal);
