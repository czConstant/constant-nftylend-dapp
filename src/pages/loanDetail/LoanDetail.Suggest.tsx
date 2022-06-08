import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Flex } from '@chakra-ui/react';

import SectionCollapse from "src/common/components/sectionCollapse";
import { getListingLoans } from "src/modules/nftLend/api";
import CardNftLoan from "src/views/apps/CardNftLoan";
import { LoanNft } from "src/modules/nftLend/models/loan";
import styles from "./styles.module.scss";

interface LoanDetailSuggestProps {
  loan: LoanNft;
}

const LoanDetailSuggest: React.FC<LoanDetailSuggestProps> = ({ loan }) => {
  const [items, setItems] = useState<Array<LoanNft>>([]);

  const collectionId = loan.asset?.collection?.id;
  const detailLoanId = loan.id;

  useEffect(() => {
    getData();
  }, [detailLoanId]);

  const getData = async () => {
    try {
      const response = await getListingLoans({
        collection_id: collectionId,
        exclude_ids: detailLoanId,
      });
      setItems(response?.result.map(LoanNft.parseFromApi));
    } catch (error) {
    } finally {
    }
  };

  const renderSuggestContent = () => {
    return (
      <Flex gap={4}>
        {items.map((loan) => loan.asset && (
          <CardNftLoan key={loan.id} asset={loan.asset} loan={loan} />
        ))}
      </Flex>
    );
  };

  if (items.length === 0) return null;

  return (
    <SectionCollapse
      id="suggest"
      label="More from this collection"
      content={renderSuggestContent()}
      selected={true}
      bodyClassName={isMobile && styles.bodyClassName}
    />
  );
};

export default LoanDetailSuggest;
