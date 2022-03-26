import { ALCHEMY_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';

export const getNftsByOwner = async (owner: string): Promise<any> => {
  return api.get(`${ALCHEMY_URL.GET_NFTS}?owner=${owner}`);
};

export const getNftMetadata = async (contractAddress: string, tokenId: string): Promise<any> => {
  return api.get(`${ALCHEMY_URL.GET_NFT_METADATA}?contractAddress=${contractAddress}&tokenId=${tokenId}`);
};