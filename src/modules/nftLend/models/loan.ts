import { CollectData } from "./collection";
import { Currency } from './api';

export class LoanData {
  id!: number;
  asset!: {
    collection: CollectData;
    token_url: string;
    seo_url: string;
  };
  curreny?: Currency;
  principal_amount?: number;
  interest_rate?: number;
  duration?: number;
}

export class LoanDataAttributes {
  trait_type!: string;
  value!: string;
}

export class LoanDataNewLoan {
  owner!: string;
  offers!: LoanDataOffers[];
}

export class LoanDataOffers {
  
}

export class LoanDataDetail {
  id!: number;
  name!: string;
  contract_address!: string;
  collection!: CollectData;
  token_url!: string;
  attributes!: LoanDataAttributes;
  new_loan!: LoanDataNewLoan;
  seller_fee_rate!: number;
}
