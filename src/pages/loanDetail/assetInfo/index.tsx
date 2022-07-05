import React from "react";
import { Flex } from '@chakra-ui/react';

import SectionCollapse from "src/common/components/sectionCollapse";
import { AssetNft } from 'src/modules/nftLend/models/nft';

import LoanDetailInfo from './LoanDetail.Info';
import LoanDetailAttr from './LoanDetail.Attr';

export interface LoanDetailAssetInfoProps {
  asset: AssetNft;
  owner: string;
}

const LoanDetailAssetInfo: React.FC<LoanDetailAssetInfoProps> = ({ asset, owner }) => {
  return (
    <Flex direction='column' gap={2}>
      <SectionCollapse
        id="description"
        label="Description"
        content={<div>{asset.detail?.description || 'There is no description'}</div>}
      />
      <SectionCollapse
        id="attributes"
        label="Attributes"
        selected
        content={<LoanDetailAttr asset={asset} />}
      />
      <SectionCollapse
        id="detail"
        label="Detail"
        content={<LoanDetailInfo asset={asset} borrower={owner} />}
      />
    </Flex>
  );
};

export default LoanDetailAssetInfo;
