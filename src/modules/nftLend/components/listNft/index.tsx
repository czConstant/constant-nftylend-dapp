import { memo } from 'react';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';

import CardNftLoan, { CardNftLoanProps } from 'src/views/apps/CardNftLoan';
import LoadingList from '../loadingList';
// import EmptyDetailLoan from '../../detailLoan/empty';
import styles from './styles.module.scss';

interface ListNftProps {
  data: Array<CardNftLoanProps>;
  isLoading?: boolean;
}

const ListNft = (props: ListNftProps) => {
  const { data, isLoading } = props;
  const loans = data || [];

  const renderItems = () => {
    return loans.map(e => (
      <CardNftLoan
        key={e.asset.id + e.asset.token_id + e.asset.contract_address}
        asset={e.asset}
        loan={e.loan}
        onClickItem={e.onClickItem}
        onCancelLoan={e.onCancelLoan}
        onViewLoan={e.onViewLoan}
      />
    ));
  };

  const renderContentList = () => {
    if (isLoading) {
      return <LoadingList />;
    } else if (loans?.length === 0) {
      // return <EmptyDetailLoan />;
    }

    return renderItems();
  };

  return (
    <div className={styles.container}>
      <div className={cx( isMobile && styles.wrapMobile, !isLoading && loans.length === 0 && styles.wrapContentEmpty, styles.wrapContent)}>
        {renderContentList()}
      </div>
    </div>
  );
};

export default memo(ListNft);
