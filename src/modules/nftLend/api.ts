import { API_URL } from "src/common/constants/url";
import api from "src/common/services/apiClient";
import { ListResponse, ResponseResult, SubmitCollection } from "./models/api";

export const getUserStats = (address: string, network: string): Promise<ResponseResult> => {
  return api.get(API_URL.NFT_LEND.USER_STATS, { params: { address, network } });
};

export const submitWhitelistCollection = (body: SubmitCollection): Promise<ResponseResult> => {
  return api.post(`${API_URL.NFT_LEND.SUBMIT_COLLECTION}`, body);
};

export const getPwpBalance = (address: string, network: string): Promise<ResponseResult> => {
  return api.get(API_URL.NFT_LEND.PWP_BALANCES, { params: { address, network } });
};

export const getBalanceTransactions = (address: string, network: string): Promise<ListResponse> => {
  return api.get(API_URL.NFT_LEND.BALANCES_TRANSACTIONS, { params: { address, network } });
};

interface ClaimPwpParams {
  user_id: number;
  currency_id: number;
  to_address: string;
  timestamp: number;
  signature: string;
  amount: number;
}
export const claimPwpBalance = (params: ClaimPwpParams): Promise<ResponseResult> => {
  return api.post(API_URL.NFT_LEND.PWP_CLAIM, params);
};