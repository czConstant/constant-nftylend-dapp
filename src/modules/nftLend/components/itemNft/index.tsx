import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { formatCurrency } from 'src/common/utils/format';
import { APP_URL } from 'src/common/constants/url';

import styles from './styles.module.scss';
import ItemNftMedia from './itemNftMedia';

export const mediaTypes = {
  video: ['mov', 'mp4', 'video'],
  img: ['jpg', 'png', 'gif', 'jpeg', 'image'],
};

interface ItemNftProps {
  item: any;
}

const ItemNFT = (props: ItemNftProps) => {
  const { item } = props;
  const navigate = useNavigate();

  if (!item) return <div className={styles.itemContainer} />;

  const onView = () => {
    if (item?.onClickItem) return item?.onClickItem(item);
    if (item?.asset?.seo_url) navigate(`${APP_URL.NFT_LENDING_LIST_LOAN}/${item?.asset?.seo_url}`);
  };

  return (
    <div className={styles.itemContainer}>
      <a onClick={onView}>
        {item?.asset?.token_url && (
          <ItemNftMedia
            tokenUrl={item?.asset?.token_url}
            name={item?.asset?.name}
            className={styles.image}
            isFetchUrl={item?.asset?.is_fetch_url}
          />
        )}

        <div className={styles.itemContent}>
          <h5>{item.asset.name}</h5>
          <div className={styles.infoWrap}>
            <div>{item.asset?.collection?.name}</div>
          </div>
          {item.principal_amount && (
            <div className={styles.infoPrice}>
              {formatCurrency(item.principal_amount)}{' '}
              {item?.currency?.symbol}
            </div>
          )}
          <div className={styles.actions}>
            {item?.onViewLoan && (
              <Button onClick={e => { e.preventDefault(); item?.onViewLoan(); }}>
                View Loan
              </Button>
            )}
            {item?.onCancelLoan && (
              <Button onClick={e => { e.preventDefault(); item?.onCancelLoan(); }} className={styles.btnCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </a>
    </div>
  );
};

export default ItemNFT;
