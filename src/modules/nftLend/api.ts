import { API_URL } from "src/common/constants/url";
import api from "src/common/services/apiClient";

export const fetchCollections = async (): Promise<any> => {
  return api.get(API_URL.NFT_LEND.COLLECTIONS);
};

interface ImageThumb {
  width: number;
  height: number;
  url: string;
  showOriginal: boolean;
}
export const getImageThumb = (params: ImageThumb) => {
  const { width, height, url, showOriginal } = params;
  if (showOriginal) return `https://solana-cdn.com/cdn-cgi/image/quality=100/${encodeURIComponent(url)}`;
  return `https://solana-cdn.com/cdn-cgi/image/width=${width},height=${height},quality=100,fit=crop/${encodeURIComponent(url)}`;
};

export const getNftListCurrency = async (): Promise<any> => {
  return api.get(API_URL.NFT_LEND.LIST_CURRENCY);
};