class CurrencyPWPTokenData {
  id!: number;
  symbol!: string;
  network!: string;
  name!: string;
  icon_url!: string;
  admin_fee_address!: string;
  price!: string;
  claim_enabled!: string;
  proposal_threshold!: string;
  contract_address!: string;
  decimals!: number;
}

class ProposalMessageData {
  timestamp!: number;
  type!: string;
  payload!: {
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
  };
}

class ProposalData {
  network!: string;
  address!: string;
  message!: string;
  signature!: string;
}

export { CurrencyPWPTokenData, ProposalData, ProposalMessageData };
