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

export const getUserStats = (address: string, network: string): Promise<ResponseResult> => {
  return api.get(API_URL.NFT_LEND.USER_STATS, { params: { address, network } });
};

export const submitWhitelistCollection = (body: SubmitCollection): Promise<ResponseResult> => {
  return api.post(`${API_URL.NFT_LEND.SUBMIT_COLLECTION}`, body);
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

interface VerfiyEmailParams extends SignatureParams {
  email: string;
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