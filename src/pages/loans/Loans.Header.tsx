import React, { useMemo } from "react";
import RandomAvatar from "./randomAvatar";
import cx from "classnames";

import homeStyles from "../home/styles.module.scss";
import styles from "./styles.module.scss";
import { LoanNft } from "src/modules/nftLend/models/loan";
import { CollectionNft } from "src/modules/nftLend/models/collection";
import Loading from "src/common/components/loading";
import { OnBoardingHeader } from "../discover";
import { isMobile } from "react-device-detect";

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
        label: "Avg Sale Price",
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
          <RandomAvatar loans={dataLoan} size={isMobile && 150} />
          <h4>{collection?.name}</h4>
          <div className={styles.infoWrap}>
            {attributes.map((att) => (
              <div key={att.id}>
                <div>{att.label}</div>
                <div>
                  {att.symbol}
                  {collection?.[`${att.id}`]}
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
    <div className={cx(homeStyles.headerWrapper, styles.headerWrapper)}>
      {renderHeaderContent()}
    </div>
  );
};

export default LoansHeader;
