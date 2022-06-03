import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import NftPawn, { CollectionData } from '@nftpawn-js/core';

import { APP_URL } from 'src/common/constants/url';
import BodyContainer from 'src/common/components/bodyContainer';

import Item from './item';
import styles from './styles.module.scss';
import { isMobile } from 'react-device-detect';
import { CollectionNft } from 'src/modules/nftLend/models/collection';

export const OnBoardingHeader = () => (
  <div className={cx(isMobile && styles.mbHeader, styles.headerWrapper)}>
    <h5>Create, explore, & collect digital art NFTs</h5>
    <h1>The new creative economy</h1>
  </div>
);

const Discover = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Array<CollectionNft>>(Array(3).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await NftPawn.collections();
      const list = response.result.filter((v: any) => v?.listing_total > 0);
      setCollections(list.map((e: CollectionData) => {
        try {
          const collection = CollectionNft.parseFromApi(e);
          return collection;
        } catch {
          return null;
        }
      }).filter((e: any) => !!e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BodyContainer className={styles.wrapper}>
      <OnBoardingHeader />
      <div className={cx(isMobile && styles.mbContentWrapper, styles.contentWrapper)}>
        <div className={styles.contentContainer}>
          {collections.map((collection, index) => (
            <Item
              key={collection?.id || index}
              item={collection}
              loading={loading}
              onPressItem={() =>
                navigate(
                  `${APP_URL.LIST_LOAN}?collection=${collection?.seo_url}`,
                )
              }
            />
          ))}
        </div>
      </div>
    </BodyContainer>
  );
};

export default Discover;
