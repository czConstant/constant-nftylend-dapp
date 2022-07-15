import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Box, Flex } from '@chakra-ui/react';

import SectionCollapse from "src/common/components/sectionCollapse";
import { getListingLoans } from "src/modules/nftLend/api";
import CardNftLoan from "src/apps/pawn/views/app/CardNftLoan";
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
        limit: 10,
      });
      setItems(response?.result.map(LoanNft.parseFromApi));
    } catch (error) {
    } finally {
    }
  };

  const renderSuggestContent = () => {
    return (
      <Flex gap={4} overflow='scroll'>
        {items.map((loan) => loan.asset && (
          <Box w={300}>
            <CardNftLoan key={loan.id} asset={loan.asset} loan={loan} />
          </Box>
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
