import { CollectData } from "./collection";

export class LoanData {
  id!: number;
  asset!: {
    collection: CollectData;
    token_url: string;
  };
}
