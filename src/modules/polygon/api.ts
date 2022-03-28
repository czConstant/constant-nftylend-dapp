import { MORALIS_API_KEY } from 'src/common/constants/config';
import { ALCHEMY_URL, MORALIS_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';

export const getNftsByOwner = async (owner: string): Promise<any> => {
  // return api.get(`${ALCHEMY_URL.GET_NFTS}?owner=${owner}`);
  return api.get(
    `${MORALIS_URL.GET_NFTS.replace('{owner}', owner)}?chain=mumbai`,
    {
      headers: {
        'X-API-Key': MORALIS_API_KEY,
      }
    }
  )
};

export const getNftMetadata = async (contractAddress: string, tokenId: string): Promise<any> => {
  return api.get(`${ALCHEMY_URL.GET_NFT_METADATA}?contractAddress=${contractAddress}&tokenId=${tokenId}`);
};