import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';
import { Box, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react';

import { getCollections } from 'src/modules/nftLend/api';
import { APP_URL } from 'src/common/constants/url';
import BodyContainer from 'src/common/components/bodyContainer';
import { CollectionData } from 'src/modules/nftLend/models/api';
import { CollectionNft } from 'src/modules/nftLend/models/collection';

import Item from './item';
import styles from './styles.module.scss';

export const OnBoardingHeader = () => (
  <Box textAlign={['left', 'center']} pt={24} px={[8, 20]}>
    <Text fontSize='xs' color='text.secondary' fontWeight='bold' letterSpacing='wider'>UNLOCK THE NEW UTILITY FOR NFTS</Text>
    <Heading as='h1' letterSpacing='wider' textTransform='uppercase'>The new creative economy</Heading>
  </Box>
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
      const response = await getCollections();
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
      <Flex px={8} py={[8, 16]} gap={8} flexWrap='wrap' justifyContent='center'>
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
      </Flex>
    </BodyContainer>
  );
};

export default Discover;
