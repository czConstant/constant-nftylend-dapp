import React, { useEffect, useState } from "react";
import SectionCollapse from "src/common/components/sectionCollapse";
import { getLoanByCollection } from "src/modules/nftLend/api";
import ItemNFT from "src/modules/nftLend/components/itemNft";
import { LoanDetailProps } from "./LoanDetail.Header";
import styles from "./styles.module.scss";

const LoanDetailSuggest: React.FC<LoanDetailProps> = ({ loan }) => {
  const [items, setItems] = useState([]);

  const collectionId = loan?.collection?.id;
  const detailLoanId = loan?.new_loan?.id;

  useEffect(() => {
    getData();
  }, [detailLoanId]);

  const getData = async () => {
    try {
      const response = await getLoanByCollection({
        collection_id: collectionId,
        exclude_ids: detailLoanId,
      });
      setItems(response?.result);
    } catch (error) {
    } finally {
    }
  };

  const renderSuggestContent = () => {
    return (
      <div className={styles.suggestWrap}>
        <div className={styles.suggestContainer}>
          {items.map((loan) => (
            <ItemNFT key={loan?.id} item={loan} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <SectionCollapse
      label="More from this collection"
      content={renderSuggestContent()}
      selected={true}
    />
  );
};

export default LoanDetailSuggest;
