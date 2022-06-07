import { Box, Flex, Text } from '@chakra-ui/react';
import { memo } from 'react';
import ContentLoader from 'react-content-loader';

import { CollectionNft } from 'src/modules/nftLend/models/collection';
import CardNftMedia from 'src/views/apps/CardNftMedia';
import styles from './styles.module.scss';

interface ItemBoardingProps {
  loading?: boolean;
  item: CollectionNft;
  onPressItem: Function;
}

const ItemBoarding = (props: ItemBoardingProps) => {
  const { loading, item, onPressItem } = props;
  const itemAsset = item.listing_asset;

  const pressItem = () => {
    if (!Boolean(onPressItem)) return null;
    return onPressItem();
  };

  return (
    <Flex p={4} gap={8} backgroundColor='background.card' overflow='hidden' borderRadius={16} direction='column' onClick={pressItem} className={styles.itemContainer}>
      <Box w={300} h={300} >
        {loading ? (
          <ContentLoader
            speed={1}
            backgroundColor="#343a40"
            foregroundColor="#6c757d"
            height={200}
          >
            <rect x="0" y="0" rx="0" ry="0" height="200" width="100%" />
          </ContentLoader>
        ) : <CardNftMedia detail={itemAsset?.detail} name={item?.name} />
        }
      </Box>
      <Flex maxW={300} w='100%' direction='column' gap={4} color='text.secondary'>
        {loading ? (
          <ContentLoader
            speed={1}
            backgroundColor="#343a40"
            foregroundColor="#6c757d"
            height={10}
          >
            <rect x="0" y="0" rx="0" ry="0" height="10" width="80%" />
          </ContentLoader>
        ) : (
          <>
            <Text fontSize='2xl' color='text.primary' fontWeight='semibold'>{item?.name}</Text>
            <Flex alignItems='center' justifyContent='space-between'>
              <div className={styles.totalItems}>
                <span>
                  {item?.listing_total} item{item?.listing_total > 1 ? 's' : ''}
                </span>
              </div>
              <div className={styles.chain}>{item.chain}</div>
            </Flex>
            <Text color='text.secondary' noOfLines={2}>{item?.description}</Text>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default memo(ItemBoarding);
