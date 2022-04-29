import React from "react";

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
    <div>
      <SectionCollapse
        id="description"
        label="Description"
        content={<div>{asset.detail?.description || 'There is no description'}</div>}
      />
      <SectionCollapse
        id="detail"
        label="Detail"
        selected
        content={<LoanDetailInfo asset={asset} borrower={owner} />}
      />
      <SectionCollapse
        id="attributes"
        label="Attributes"
        content={<LoanDetailAttr asset={asset} />}
      />
    </div>
  );
};

export default LoanDetailAssetInfo;
