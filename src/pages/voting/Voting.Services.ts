import { API_URL } from "src/common/constants/url";
import api from "src/common/services/apiClient";
import { ListResponse } from "src/modules/nftLend/models/api";
import {
  CurrencyPWPTokenData,
  ProposalData,
  ProposalListItemData,
  ProposalListRequest,
} from "./Voting.Services.Data";

const VotingServices = {
  async getCurrenciesPWP(): Promise<CurrencyPWPTokenData> {
    try {
      const response: ListResponse = await api.get(
        `${API_URL.NFT_LEND.VOTING_CURRENCIES}`
      );
      const result: CurrencyPWPTokenData = response.result;
      return result;
    } catch (error) {
      throw error;
    }
  },
  async createProposal(body: ProposalData): Promise<CurrencyPWPTokenData> {
    try {
      const response: any = await api.post(
        `${API_URL.NFT_LEND.VOTING_PROPOSAL}`,
        body
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getProposals(params: ProposalListRequest): Promise<ProposalListItemData[]> {
    try {
      const response: ListResponse = await api.get(
        `${API_URL.NFT_LEND.VOTING_PROPOSAL_LIST}`,
        {
          params
        }
      );
      const result: ProposalListItemData[] = response.result;
      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default VotingServices;
