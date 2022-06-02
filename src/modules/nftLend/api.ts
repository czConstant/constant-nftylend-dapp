import { API_URL } from "src/common/constants/url";
import api from "src/common/services/apiClient";
import { ListResponse, ResponseResult, SubmitCollection } from "./models/api";

interface ListParams {
  offset?: number;
  limit?: number;
}

export const getPlatformStats = async (): Promise<ResponseResult> => {
  return api.get(API_URL.NFT_LEND.PLATFORM_STATS);
};

export const getNftListCurrency = async (network: string = ''): Promise<ListResponse> => {
  return api.get(`${API_URL.NFT_LEND.LIST_CURRENCY}?network=${network}`);
};

export const getCollections = (params?: ListParams): Promise<ListResponse> => {
  return api.get(API_URL.NFT_LEND.COLLECTIONS, { params });
};

export const getCollection = (seo_url: string): Promise<ResponseResult> => {
  return api.get(`${API_URL.NFT_LEND.COLLECTION_BY_ID}/${seo_url}`);
};

export interface GetListingLoanParams {
  collection_seo_url?: string | undefined;
  collection?: string;
  exclude_ids?: string;
  min_price?: number;
  max_price?: number;
  network?: string;
  page: number;
  limit: number;
}
export const getListingLoans = (
  params?: GetListingLoanParams
): Promise<ListResponse> => {
  return api.get(API_URL.NFT_LEND.ALL_LISTING_LOANS, {
    params,
  });
};

interface LoanByAssetParams {
  asset_id?: string;
}
export const getLoansByAssetId = (
  params: LoanByAssetParams
): Promise<ListResponse> => {
  return api.get(`${API_URL.NFT_LEND.GET_LOANS}`, { params });
};

export const getAssetBySeo = (seo: number | string): Promise<any> => {
  return api.get(`${API_URL.NFT_LEND.ASSET_BY_SEO}/${seo}`);
};

export const getAssetInfo = (contractAddress: string, tokenId?: string): Promise<any> => {
  return api.get(
    API_URL.NFT_LEND.ASSET_INFO,
    { params: { contract_address: contractAddress, token_id: tokenId } },
  );
};

interface LoanByOwnerParams {
  owner?: string;
  status?: "new" | "created" | "cancelled" | "done" | "liquidated";
}
/* status=new,created,cancelled,done,liquidated */
export const getLoansByOwner = (
  params: LoanByOwnerParams
): Promise<ListResponse> => {
  return api.get(`${API_URL.NFT_LEND.GET_LOANS}`, { params });
};

interface OffersParams {
  borrower?: string;
  lender?: string;
  network?: string;
  status?:
    | "new"
    | "approved"
    | "rejected"
    | "cancelled"
    | "done"
    | "liquidated"
    | "repaid"
    | "";
}
/* new,approved,rejected,cancelled,repaid,liquidated,done */
export const getOffersByFilter = (
  params: OffersParams
): Promise<ListResponse> => {
  return api.get(`${API_URL.NFT_LEND.GET_OFERS}`, { params });
};

export const verifyAsset = (mint: string): Promise<ResponseResult> => {
  return api.get(`${API_URL.NFT_LEND.VERIFY_ASSET}`, { params: { mint } });
};

export const getSystemConfigs = (): Promise<ResponseResult> => {
  return api.get(`${API_URL.NFT_LEND.GET_SYSTEM_CONFIGS}`);
};

interface LoanTransactionParams {
  status?: "listed" | "cancelled" | "offered" | "repaid" | "liquidated";
  asset_id: string;
}

export const getLoanTransactions = (
  params: LoanTransactionParams
): Promise<ListResponse> => {
  return api.get(`${API_URL.NFT_LEND.LOAN_TRANSACTION}`, { params });
};

export const getSaleTransactions = (
  params: LoanTransactionParams
): Promise<ListResponse> => {
  return api.get(`${API_URL.NFT_LEND.SALE_TRANSACTION}`, { params });
};

export const submitWhitelistCollection = (body: SubmitCollection): Promise<ResponseResult> => {
  return api.post(`${API_URL.NFT_LEND.SUBMIT_COLLECTION}`, body);
};

export const getBorrowerStats = (address: string): Promise<ResponseResult> => {
  return api.get(`${API_URL.NFT_LEND.BORROWER_STATS}/${address}`);
};
