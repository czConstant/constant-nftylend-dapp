import { API_URL } from "src/common/constants/url";
import api from "src/common/services/apiClient";
import { ListResponse, ResponseResult, SubmitCollection } from "./models/api";

interface ListParams {
  page?: number;
  limit?: number;
}

interface SignatureParams {
  address: string;
  network: string;
  timestamp: number;
  signature: string;
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
  search?: string;
  sort?: string;
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
  page?: number,
  limit?: number,
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

interface VerifyAssetParams {
  network: string;
  contract_address?: string;
  token_id?: string;
}

export const verifyAsset = (params: VerifyAssetParams): Promise<ResponseResult> => {
  return api.get(`${API_URL.NFT_LEND.VERIFY_ASSET}`, { params });
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

export const getBorrowerStats = (address: string, network: string): Promise<ResponseResult> => {
  return api.get(API_URL.NFT_LEND.BORROWER_STATS, { params: { address, network }});
};

export const getUserPwpBalance = (address: string, network: string): Promise<ResponseResult> => {
  return api.get(API_URL.NFT_LEND.PWP_BALANCES, { params: { address, network } });
};

export const getUserNearBalance = (address: string, network: string): Promise<ResponseResult> => {
  return api.get(API_URL.NFT_LEND.NEAR_BALANCES, { params: { address, network } });
};

export const getBalanceTransactions = (address: string, network: string, currencyId: number): Promise<ListResponse> => {
  return api.get(API_URL.NFT_LEND.BALANCES_TRANSACTIONS, { params: { address, network, currency_id: currencyId } });
};

export const getUserStats = (address: string, network: string): Promise<ResponseResult> => {
  return api.get(API_URL.NFT_LEND.USER_STATS, { params: { address, network } });
};

interface ClaimCurrencyParams extends SignatureParams {
  currency_id: number;
  amount: number;
}
export const claimCurrencyBalance = (params: ClaimCurrencyParams): Promise<ResponseResult> => {
  return api.post(API_URL.NFT_LEND.PWP_CLAIM, params);
};

export const getNearWhitelistCollections = async (): Promise<ListResponse> => {
  return api.get(API_URL.NFT_LEND.NEAR_WHITELIST_COLLECTIONS)
}

export const getUserSettings = async (address: string, network: string): Promise<ResponseResult> => {
  return api.get(API_URL.NFT_LEND.USER_SETTINGS, { params: { network, address }});
}


interface ConnectUserFromReferParams extends SignatureParams {
  referrer_code: string;
}
export const connectUserFromRefer = async (params: ConnectUserFromReferParams): Promise<ResponseResult> => {
  return api.post(API_URL.NFT_LEND.USER_CONNECTED, params);
}

interface UserSettingsParams extends SignatureParams {
  news_noti_enabled?: boolean;
  loan_noti_enabled?: boolean;
  email?: string;
}

export const changeUserSettings = async (params: UserSettingsParams): Promise<ResponseResult> => {
  return api.post(API_URL.NFT_LEND.USER_SETTINGS, params);
}

interface VerfiyEmailParams {
  email: boolean;
  network: string;
  address: string;
  timestamp:number;
  signature: string;
}
export const verifyUserEmail = async (params: VerfiyEmailParams): Promise<ResponseResult> => {
  return api.post(API_URL.NFT_LEND.VERIFY_EMAIL, params);
}

export const verifyEmailToken = async (email: string, token: string): Promise<ResponseResult> => {
  return api.post(API_URL.NFT_LEND.VERIFY_TOKEN, { email, token });
}

export const getAffiliateStats = (address: string, network: string): Promise<ResponseResult> => {
  return api.get(API_URL.NFT_LEND.AFFILIATE_STATS, { params: { address, network }})
}

interface AffiliateVolumeOptions {
  address: string
  network: string
  rpt_by: string
  limit: number
}
export const getAffiliateVolumes = (params: AffiliateVolumeOptions): Promise<ResponseResult> => {
  return api.get(API_URL.NFT_LEND.AFFILIATE_VOLUMES, { params })
}

interface AffiliateTransactionsParams extends ListParams {
  address: string
  network: string
}

export const getAffiliateTransactions = (params: AffiliateTransactionsParams): Promise<ListResponse> => {
  return api.get(API_URL.NFT_LEND.AFFILIATE_TRANSACTIONS, { params })
}

interface ApplyAffiliate {
  address: string
  network: string
  contact: string
  full_name: string
  website: string
  description: string
}
export const applyAffiliate = (params: ApplyAffiliate): Promise<ResponseResult> => {
  return api.post(API_URL.NFT_LEND.APPLY_AFFILIATE, params)
}