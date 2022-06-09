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

interface ProposalListItemData
  extends ProposalData,
    ProposalMessageData,
    ProposalMessagePayloadData {
  user: ProposalUserData;
  user_id: number;
  id: string;
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

interface ProposalListRequest {
  status?: ProposalStatus;
}

export { ProposalStatus };

export type {
  CurrencyPWPTokenData,
  ProposalData,
  ProposalMessageData,
  ProposalUserData,
  ProposalListItemData,
  ProposalListRequest,
};
