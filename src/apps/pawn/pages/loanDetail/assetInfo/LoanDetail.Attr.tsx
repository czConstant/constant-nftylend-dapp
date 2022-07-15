import React from "react";
import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { AssetNft, AssetNftAttribute } from 'src/modules/nftLend/models/nft';
import BoxAttrValue from 'src/apps/pawn/views/loanDetail/BoxAttrValue';

interface LoanDetailAttrProps {
  asset: AssetNft;
};

const LoanDetailAttr: React.FC<LoanDetailAttrProps> = ({ asset }) => {
  const attrs: AssetNftAttribute[] = asset.detail?.attributes || [];
  
  return (
    <Grid templateColumns={{ md: 'repeat(3, 1fr)' }} gap={2}>
      {attrs?.length === 0 ? (
        <div>No Attributes</div>
      ) : (
        attrs?.map((attr) => (
          <GridItem key={attr?.trait_type}>
            <BoxAttrValue
              label={attr?.trait_type}
              value={attr?.value}
            />
          </GridItem>
        ))
      )}
    </Grid>
  );
};

export default LoanDetailAttr;
