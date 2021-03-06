import { API_URL } from "src/common/constants/url";
import api from "src/common/services/apiClient";
import { getRecaptcha } from 'src/common/services/recaptchaV3';
import { ListResponse, ResponseResult } from "src/modules/nftLend/models/api";
import {
  CurrencyPWPTokenData,
  ProposalCheckVoteParams,
  ProposalData,
  ProposalListItemData,
  ProposalListRequest,
  ProposalStatus,
  ProposalVoteCheckData,
  ProposalVoteData,
  ProposalVoteRequest,
  ProposalVotesData,
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
      const recaptcha = await getRecaptcha('createProposal');
      const response: ResponseResult = await api.post(
        `${API_URL.NFT_LEND.VOTING_PROPOSAL}`,
        body,
        { headers: { recaptcha }}
      );
      const result: ProposalListItemData = response.result;
      return result;
    } catch (error) {
      throw error;
    }
  },
  async getProposals(
    params: ProposalListRequest
  ): Promise<ProposalListItemData[]> {
    try {
      const response: ListResponse = await api.get(
        `${API_URL.NFT_LEND.VOTING_PROPOSAL_LIST}`,
        {
          params,
        }
      );
      const result: ProposalListItemData[] = response.result;
      return result;
    } catch (error) {
      throw error;
    }
  },
  async getProposal(id: string): Promise<ProposalListItemData> {
    try {
      const response: ListResponse = await api.get(
        `${API_URL.NFT_LEND.VOTING_PROPOSAL_DETAIL}/${id}`
      );
      const result: ProposalListItemData = response.result;
      return result;
    } catch (error) {
      throw error;
    }
  },
  async getProposalVotes(id: string): Promise<ProposalVotesData[]> {
    try {
      const response: ListResponse = await api.get(
        `${API_URL.NFT_LEND.VOTING_PROPOSAL_DETAIL_VOTES}/${id}`,
        {
          params: {
            status: ProposalStatus.ProposalStatusCreated,
          },
        }
      );
      const result: ProposalVotesData[] = response.result;
      return result;
    } catch (error) {
      throw error;
    }
  },
  async voteProposal(body: ProposalVoteRequest): Promise<ProposalVoteData> {
    try {
      const recaptcha = await getRecaptcha('voteProposal');
      const response: ListResponse = await api.post(
        API_URL.NFT_LEND.VOTING_PROPOSAL_VOTE_CREATE,
        body,
        { headers: { recaptcha } }
      );
      const result: ProposalVoteData = response.result;
      return result;
    } catch (error) {
      throw error;
    }
  },
  async checkVoteProposal(
    params: ProposalCheckVoteParams
  ): Promise<ProposalVoteCheckData> {
    try {
      const response: ListResponse = await api.get(
        `${API_URL.NFT_LEND.VOTING_PROPOSAL_VOTE_CHECK}/${params.proposal_id}`,
        {
          params,
        }
      );
      const result: ProposalVoteCheckData = response.result;
      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default VotingServices;
