import { API_URL } from "src/common/constants/url";
import api from "src/common/services/apiClient";
import { ListResponse } from "./models/api";
import { CollectData } from "./models/collection";
import { LoanData } from "./models/loan";

export const fetchCollections = async (): Promise<CollectData> => {
  return api.get(API_URL.NFT_LEND.COLLECTIONS);
};

interface LoanByCollectionParams {
  collection_id?: string;
  exclude_ids?: string;
  min_price?: number;
  max_price?: number;
}
export const fetchLoanByCollection = async (
  params?: LoanByCollectionParams
): Promise<ListResponse> => {
  return api.get(API_URL.NFT_LEND.ALL_LISTING_LOANS, {
    params,
  });
};

interface ImageThumb {
  width: number;
  height: number;
  url: string;
  showOriginal?: boolean;
}
export const getImageThumb = (params: ImageThumb) => {
  const { width, height, url, showOriginal } = params;
  if (showOriginal)
    return `https://solana-cdn.com/cdn-cgi/image/quality=100/${encodeURIComponent(
      url
    )}`;
  return `https://solana-cdn.com/cdn-cgi/image/width=${width},height=${height},quality=100,fit=crop/${encodeURIComponent(
    url
  )}`;
};

export const getNftListCurrency = async (): Promise<any> => {
  return api.get(API_URL.NFT_LEND.LIST_CURRENCY);
};

export const getCollections = (): Promise<any> => {
  return api.get(API_URL.NFT_LEND.COLLECTIONS);
}

export const getCollectionById = (id: number): Promise<any> => {
  return api.get(`${API_URL.NFT_LEND.COLLECTION_BY_ID}/${id}`);
}

export const getLoanByCollection = (params): Promise<any> => {
  return api.get(`${API_URL.NFT_LEND.ALL_LISTING_LOANS}?collection_id=${params?.collection_id}&exclude_ids=${params?.exclude_ids}&min_price=${params?.min_price}&max_price=${params?.max_price}`);
}

export const getLoansByAssetId = (params): Promise<any> => {
  return api.get(`${API_URL.NFT_LEND.GET_LOANS}?asset_id=${params?.asset_id}`);
}

export const getLoanById = (id: number): Promise<any> => {
  return api.get(`${API_URL.NFT_LEND.LOANS_BY_ID}/${id}`);
}

/* status=new,created,cancelled,done,liquidated */
export const getLoansByOwner = (address: string, status: string = ''): Promise<any> => {
  return api.get(`${API_URL.NFT_LEND.GET_LOANS}?owner=${address}&status=${status}`);
}

/* new,approved,rejected,cancelled,repaid,liquidated,done */
export const getOffersByFilter = ({ lender = '', borrower = '', status = '' }): Promise<any> => {
  return api.get(`${API_URL.NFT_LEND.GET_OFERS}?lender=${lender}&borrower=${borrower}&status=${status}`);
}
