import { API_URL } from "src/common/constants/url";
import api from "src/common/services/apiClient";
import { ListResponse } from "./models/api";
import { CollectData } from "./models/collection";
import { LoanData } from "./models/loan";

export const fetchCollections = async (): Promise<CollectData> => {
  return api.get(API_URL.NFT_LEND.COLLECTIONS);
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

export const getCollections = (): Promise<ListResponse> => {
  return api.get(API_URL.NFT_LEND.COLLECTIONS);
}

export const getCollectionById = (id: number): Promise<ListResponse> => {
  return api.get(`${API_URL.NFT_LEND.COLLECTION_BY_ID}/${id}`);
}


interface LoanByCollectionParams {
  collection_id?: string;
  exclude_ids?: string;
  min_price?: number;
  max_price?: number;
}
export const getLoanByCollection = (params: LoanByCollectionParams): Promise<ListResponse> => {
  return api.get(API_URL.NFT_LEND.ALL_LISTING_LOANS, {
    params,
  });
}

interface LoanByAssetParams {
  asset_id?: string;
}
export const getLoansByAssetId = (params:LoanByAssetParams): Promise<ListResponse> => {
  return api.get(`${API_URL.NFT_LEND.GET_LOANS}`, { params });
}


export const getLoanById = (id: number): Promise<any> => {
  return api.get(`${API_URL.NFT_LEND.LOANS_BY_ID}/${id}`);
}


interface LoanByOwnerParams {
  owner?: string;
  status?: 'new' | 'created' | 'cancelled' | 'done' | 'liquidated';
}
/* status=new,created,cancelled,done,liquidated */
export const getLoansByOwner = (params: LoanByOwnerParams): Promise<ListResponse> => {
  return api.get(`${API_URL.NFT_LEND.GET_LOANS}`, { params });
}

interface OffersParams {
  borrower?: string;
  lender?: string;
  status?: 'new' | 'approved' | 'rejected' | 'cancelled' | 'done' | 'liquidated' | 'repaid' | '';
}
/* new,approved,rejected,cancelled,repaid,liquidated,done */
export const getOffersByFilter = (params: OffersParams): Promise<ListResponse> => {
  return api.get(`${API_URL.NFT_LEND.GET_OFERS}`, { params });
}
