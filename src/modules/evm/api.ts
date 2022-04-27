import { MORALIS_API_KEY } from 'src/common/constants/config';
import { Chain, MoralisChainName } from 'src/common/constants/network';
import { API_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';
import { EvmNft } from './models/evmNft';

export const getEvmNftsByOwner = async (owner: string, chain: Chain): Promise<any> => {
  if (chain === Chain.Boba) return { result: [] };
  const chainName = MoralisChainName[chain];
  const res = await api.get(
    `${API_URL.MORALIS.GET_NFTS.replace('{owner}', owner)}?chain=${chainName}`,
    {
      headers: {
        'X-API-Key': MORALIS_API_KEY,
      }
    }
  )
  return res.result.map(e => {
    const nft = EvmNft.parse(e, chain);
    nft.owner = owner;
    return nft;
  })
};