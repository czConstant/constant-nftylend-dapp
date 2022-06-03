import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Button, Dropdown } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';
import NftPawn from '@nftpawn-js/core';

import CardNftMedia from 'src/views/apps/CardNftMedia';
import { APP_URL } from 'src/common/constants/url';
import Loading from 'src/common/components/loading';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import styles from './styles.module.scss';

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
  const [collectionName, setCollectionName] = useState('');

  useEffect(() => {
    if (asset.needFetchDetail()) getExtraData();
    verifiedCollection();
    checkLoanInfo();
  }, [asset]);

  const verifiedCollection = async () => {
    try {
      setVerifying(true);
      const response = await NftPawn.collectionVerified({
        network: asset.chain,
        contract_address: asset.contract_address,
        token_id: asset.token_id
      });
      setListingDetail(response.result);
    } catch (error) {
    } finally {
      setVerifying(false);
    }
  };

  const checkLoanInfo = async () => {
    try {
      setVerifying(true);
      const res = await NftPawn.loan({ contract_address: asset.contract_address, token_id: asset.token_id});
      const loan = LoanNft.parseFromApiDetail(res.result);
      setLoan(loan);
      setCollectionName(res.result.collection?.name);
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
    navigate(`${APP_URL.LIST_LOAN}/${loan?.seo_url}`);
  };

  const renderButton = () => {
    if (verifying) return <Loading />;
    if (loan?.isListing()) return (
      <Button onClick={onGoTtoLoan} className={styles.btnGoToLoan}>
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
        This NFT Collection is currently unavailable. We are working with the NFT community to whitelist quality projects to protect our investors.
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
      <CardNftMedia
        name={asset.name}
        className={cx(extraData?.attributes?.length > 6 && styles.largeImage)}
        detail={extraData}
        loading={loading}
      />
      <div>
        <h4>{asset.name}</h4>
        <div>{collectionName}</div>
        <div>
          <a
            className={styles.infoAuthor}
            target="_blank"
            href={`${
              APP_URL.LIST_LOAN
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
