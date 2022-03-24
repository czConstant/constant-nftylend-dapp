import React, { useEffect, useState } from 'react';
import last from 'lodash/last';
import cx from 'classnames';
import { Button, Dropdown } from 'react-bootstrap';

import styles from './styles.module.scss';
import ItemNftMedia from '../itemNft/itemNftMedia';
import { APP_URL } from 'src/common/constants/url';
import { verifyAsset } from '../../api';
import Loading from 'src/common/components/loading';
import { isMobile } from 'react-device-detect';
import { AssetNft } from '../../models/nft';

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

  useEffect(() => {
    if (asset.needFetchDetail()) getExtraData();
    verifiedCollection();
  }, [asset]);

  const verifiedCollection = async () => {
    try {
      setVerifying(true);
      const response = await verifyAsset(asset.id as string);
      setListingDetail(response.result);
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

  const onClickVerify = () => {
    onClose();
    const name = extraData?.collection?.name;
    const author = extraData?.properties?.creators[0]?.address;
    navigate(`${APP_URL.NFT_LENDING_SUBMIT_WHITELIST}?collection=${name}&creator=${author}`);
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
        <div >
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
        <div className={cx(styles.actions)}>
          {verifying
            ? <Loading />
            : listingDetail
              ? (
                <Button onClick={onClickMakeLoan} className={styles.btnConnect}>
                  Make a Loan
                </Button>
              ) : (
                <div className={styles.notVerified}>
                  Assets on NFTy Lend are required verification by us to use as collateral. Please <a onClick={onClickVerify}>submit verification form</a> for this collection.
                </div>
              )
          }
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

export default AssetDetailModal;
