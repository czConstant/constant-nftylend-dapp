import React, { useEffect, useState } from 'react';
import axios from 'axios';
import last from 'lodash/last';
import cx from 'classnames';
import { Button, Dropdown } from 'react-bootstrap';

import styles from './styles.module.scss';
import { getLinkSolScanAccount, getLinkSolScanExplorer } from 'src/common/utils/solana';
import ItemNftMedia from '../itemNft/itemNftMedia';
import { APP_URL } from 'src/common/constants/url';

interface AssetDetailModalProps {
  item: any;
  onClose: Function;
};

const AssetDetailModal = (props: AssetDetailModalProps) => {
  const { item, onClose } = props;

  const [extraData, setExtraData] = useState({} as any);

  useEffect(() => {
    getExtraData();
  }, []);

  const getExtraData = async () => {
    try {
      const response = await axios.get(item?.asset?.token_url);
      setExtraData(response.data);
    } catch (error) {
    } finally {
    }
  };

  const onMakeLoan = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    item?.onMakeLoan();
  }

  return (
    <div className={styles.assetDetailModal}>
      <ItemNftMedia
        tokenUrl={item?.asset?.token_url}
        name={item?.asset?.name}
        className={styles.image}
        isFetchUrl={item?.asset?.is_fetch_url}
      />
      <div>
        <h4>{item?.asset?.name}</h4>
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
            href={getLinkSolScanAccount(
              last(extraData?.properties?.creators)?.address,
            )}
          >
            Creators
          </a>{' '}
          ·{' '}
          <a
            target="_blank"
            href={getLinkSolScanAccount(item?.asset?.authority)}
          >
            Authority
          </a>
        </div>
        <div className={cx(styles.actions, styles.groupOfferButtons)}>
          <Button onClick={onMakeLoan} className={styles.btnConnect}>
            Make a Loan
          </Button>
          <Dropdown align={'end'} className={styles.dropdown}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <i className="far fa-ellipsis-v"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                target="_blank"
                href={getLinkSolScanExplorer(item?.asset?.mint)}
              >
                View in explorer
              </Dropdown.Item>
              <Dropdown.Item target="_blank" href={item?.asset?.token_url}>
                View raw JSON
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className={styles.description}>{extraData?.description}</div>
        {extraData?.attributes?.length > 0 && (
          <div className={styles.attContainer}>
            <label>Attributes</label>
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
