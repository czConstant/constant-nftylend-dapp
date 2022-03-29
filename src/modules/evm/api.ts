import { MORALIS_API_KEY } from 'src/common/constants/config';
import { Chain, MoralisChainName } from 'src/common/constants/network';
import { MORALIS_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';

export const getNftsByOwner = async (owner: string, chain: Chain): Promise<any> => {
  const chainName = MoralisChainName[chain];
  return api.get(
    `${MORALIS_URL.GET_NFTS.replace('{owner}', owner)}?chain=${chainName}`,
    {
      headers: {
        'X-API-Key': MORALIS_API_KEY,
      }
    }
  )
};