import React, { useMemo } from "react";
import { Box, Flex, Text } from '@chakra-ui/react';
import { shortCryptoAddress } from "src/common/utils/format";
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { getLinkETHScanAddress, getLinkETHScanTokenId } from "src/modules/solana/utils";
import { APP_URL } from 'src/common/constants/url';

interface LoanDetailAssetInfoProps {
  asset: AssetNft;
  borrower: string;
}

const LoanDetailInfo: React.FC<LoanDetailAssetInfoProps> = ({ asset, borrower }) => {
  const details = useMemo(() => {
    let details = [
      {
        label: "Mint address",
        value: `<a target="_blank" href="${asset.getLinkExplorer()}">${shortCryptoAddress(asset.contract_address)}</a>`,
      },
      {
        label: "Owner",
        value: `<a href="${APP_URL.BORROWER}?address=${borrower}">${shortCryptoAddress(borrower)}</a>`,
      },
    ];
    if (asset.origin_contract_address) {
      details.push(
        {
          label: "Original Contract Address",
          value: `<a target="_blank" href="${getLinkETHScanAddress(
            asset.origin_contract_address
          )}">${shortCryptoAddress(asset.origin_contract_address)}</a>`,
        },
        {
          label: "Original Network",
          value: `${asset.origin_contract_network}`,
        },
        {
          label: "Original Contract Id",
          value: `<a target="_blank" href="${getLinkETHScanTokenId(
            asset.origin_contract_address,
            asset.origin_token_id
          )}">${asset.origin_token_id}</a>`,
        }
      );
    }
    details.push(
      {
        label: "Artist Royalties",
        value: `${(asset.detail?.seller_fee_rate || 0) * 100}%`,
      },
      {
        label: "Listing/Bidding/Cancel",
        value: "Free",
      }
    );
    return details;
  }, [asset]);

  return (
    <Flex direction='column' gap={2}>
      {details.map((v) => (
        <Flex key={v.label} fontSize='sm' alignItems='center' justifyContent='space-between'>
          <Text color='text.secondary'>{v.label}</Text>
          <Box fontWeight='semibold' dangerouslySetInnerHTML={{ __html: v.value }} />
        </Flex>
      ))}
    </Flex>
  );
};

export default LoanDetailInfo;
