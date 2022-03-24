import { ALCHEMY_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';

export const getNftsByOwner = async (owner: string): Promise<any> => {
  return api.get(`${ALCHEMY_URL.GET_NFTS}?owner=${owner}`);
};