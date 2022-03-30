import { memo } from 'react';
import ContentLoader from 'react-content-loader';

import ItemNftMedia from 'src/modules/nftLend/components/itemNft/itemNftMedia';
import { CollectionNft } from 'src/modules/nftLend/models/collection';
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
    <div onClick={pressItem} className={styles.itemContainer}>
      <div className={styles.image}>
        {loading ? (
          <ContentLoader
            speed={1}
            backgroundColor="#343a40"
            foregroundColor="#6c757d"
            height={200}
          >
            <rect x="0" y="0" rx="0" ry="0" height="200" width="100%" />
          </ContentLoader>
        ) : <ItemNftMedia detail={itemAsset?.detail} name={item?.name} />
        }
      </div>
      <div className={styles.body}>
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
            <h4>{item?.name}</h4>
            <div className={styles.info}>
              <div className={styles.totalItems}>
                <span>
                  {item?.listing_total} item{item?.listing_total > 1 ? 's' : ''}
                </span>
              </div>
              <div className={styles.chain}>{item.chain}</div>
            </div>
            <p>
              {item?.description?.length > 115
                ? `${item?.description?.slice(0, 115)}...`
                : item?.description}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(ItemBoarding);
