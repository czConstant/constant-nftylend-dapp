import React, { useMemo } from "react";
import { isMobile } from "react-device-detect";
import cx from 'classnames';

import { LoanNft } from "src/modules/nftLend/models/loan";
import { CollectionNft } from "src/modules/nftLend/models/collection";
import Loading from "src/common/components/loading";
import Avatar from 'src/common/components/avatar';
import { formatCurrency } from 'src/common/utils/format';
import { getImageThumb } from 'src/modules/nftLend/utils';
import aboutStyles from "src/pages/about/styles.module.scss";

import { OnBoardingHeader } from "../discover";
import IcVerified from './icon-verified.svg';
import styles from "./styles.module.scss";

interface LoansHeaderProps {
  dataLoan: Array<LoanNft>;
  isLoading: boolean;
  collection?: CollectionNft;
  collections?: Array<CollectionNft>;
}

const LoansHeader: React.FC<LoansHeaderProps> = ({
  collection,
  collections,
  isLoading,
  dataLoan,
}) => {
  const attributes = useMemo(
    () => [
      {
        id: "total_volume",
        label: "Total Volume",
        symbol: "$",
      },
      {
        id: "avg24h_amount",
        label: "Avg Loan Price",
        symbol: "$",
      },
      {
        id: "total_listed",
        label: "Total Listed Count",
      },
    ],
    []
  );

  const renderHeaderContent = () => {
    if (isLoading) {
      return <Loading />;
    } else if (collection) {
      return (
        <>
          <Avatar
            img={getImageThumb({ url: collection.random_asset?.detail?.image || '', width: 300, height: 300 })}
            name={collection.random_asset?.name}
            size={isMobile ? 150 : 300}
          />
          {/* <RandomAvatar loans={dataLoan} size={isMobile ? 150 : 300} /> */}
          <h4>{collection?.name} {collection.verified && <img src={IcVerified} />}</h4>
          <div className={styles.infoWrap}>
            {attributes.map((att) => (
              <div key={att.id}>
                <div>{att.label}</div>
                <div>
                  {att.symbol}
                  {formatCurrency(Number(collection[att.id]))}
                </div>
              </div>
            ))}
          </div>
          <p>{collection?.description}</p>
        </>
      );
    } else {
      return <OnBoardingHeader />
    }
  };

  if (!collection) return null;

  return (
    <div className={cx(aboutStyles.headerWrapper, styles.headerWrapper)}>
      {renderHeaderContent()}
    </div>
  );
};

export default LoansHeader;
