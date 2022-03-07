import { CollectData } from "./collection";

export class LoanData {
  id!: number;
  asset!: {
    collection: CollectData;
    token_url: string;
  };
}

export class LoanDataAttributes {
  trait_type!: string;
  value!: string;
}

export class LoanDataNewLoan {
  owner!: string;
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
