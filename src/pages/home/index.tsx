import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchCollections } from 'src/modules/nftLend/api';
import { APP_URL } from 'src/common/constants/url';
import BodyContainer from 'src/common/components/bodyContainer';

import Item from './item';
import styles from './styles.module.scss';

export const OnBoardingHeader = () => (
  <div className={styles.headerWrapper}>
    <h5>Create, explore, & collect digital art NFTs.</h5>
    <h1>The new creative economy.</h1>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState(Array(3).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetchCollections();
      setCollections(response.result?.filter((v: any) => v?.listing_total > 0));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BodyContainer className={styles.wrapper}>
      <OnBoardingHeader />
      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          {collections.map((collection, index) => (
            <Item
              key={collection?.id || index}
              item={collection}
              loading={loading}
              onPressItem={() =>
                navigate(
                  `${APP_URL.NFT_LENDING_LIST_LOAN}?collection=${collection?.seo_url}`,
                )
              }
            />
          ))}
        </div>
      </div>
    </BodyContainer>
  );
};

export default Home;
