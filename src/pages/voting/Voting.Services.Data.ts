interface CurrencyPWPTokenData {
  id: number;
  symbol: string;
  network: string;
  name: string;
  icon_url: string;
  admin_fee_address: string;
  price: string;
  claim_enabled: string;
  proposal_threshold: string;
  contract_address: string;
  decimals: number;
}

interface ProposalMessagePayloadData {
  name: string;
  body: string;
  snapshot: number;
  start: number;
  end: number;
  choices: string[];
  type: string;
  metadata: {
    network: string;
    token: {
      name: string;
      params: {
        symbol: string;
        address: string;
        decimals: number;
      };
    };
  };
}

interface ProposalMessageData {
  timestamp: number;
  type: string;
  payload: ProposalMessagePayloadData;
}

interface ProposalData {
  network: string;
  address: string;
  message: string;
  signature: string;
}

interface ProposalUserData {
  id: number;
  network: string;
  address: string;
  email: string;
  news_noti_enabled: boolean;
  loan_noti_enabled: boolean;
  seen_noti_id: number;
}

interface ProposalChoiceData {
  id: number;
  name: string;
  network: string;
  power_vote: string;
  choice: string;
  status: ProposalStatus;
  proposal_id: number;
}

interface ProposalListItemData
  extends ProposalData,
    ProposalMessageData,
    ProposalMessagePayloadData {
  user: ProposalUserData;
  user_id: number;
  id: string;
  status: ProposalStatus;
  choices: ProposalChoiceData[];
  ipfs_hash: string;
}

interface ProposalVotesData extends ProposalListItemData, ProposalChoiceData {
  proposal_choice: ProposalChoiceData;
}

enum ProposalStatus {
  ProposalStatusPending = "pending",
  ProposalStatusCreated = "created",
  ProposalStatusCancelled = "cancelled",
  ProposalStatusSucceeded = "succeeded",
  ProposalStatusDefeated = "defeated",
  ProposalStatusQueued = "queued",
  ProposalStatusExecuted = "executed",
}

enum ProposalTypes {
  Gov = "government",
  Community = "community",
}

interface ProposalTypeData {
  active: boolean;
  key: string;
  name: string;
}

interface ProposalListRequest {
  status?: ProposalStatus;
  type?: string;
}

interface ProposalVoteMessage {
  version: string;
  timestamp: number;
  space: string;
  type: string;
  payload: {
    proposal: string;
    choice: number;
  };
}

interface ProposalVoteRequest extends ProposalData {
  version: string;
  message: string;
}

interface ProposalCheckVoteParams {
  proposal_id: string;
  network: string;
  address: string;
}

interface ProposalVoteData {
  proposal_choice: ProposalVoteData;
}

interface ProposalVoteCheckData {
  proposal_choice_id: number;
}

export { ProposalStatus, ProposalTypes };

export type {
  CurrencyPWPTokenData,
  ProposalData,
  ProposalMessageData,
  ProposalUserData,
  ProposalListItemData,
  ProposalListRequest,
  ProposalChoiceData,
  ProposalVoteRequest,
  ProposalVotesData,
  ProposalVoteData,
  ProposalVoteMessage,
  ProposalCheckVoteParams,
  ProposalVoteCheckData,
  ProposalTypeData,
};
