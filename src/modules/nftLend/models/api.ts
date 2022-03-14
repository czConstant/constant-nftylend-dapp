export class ResponseResult {
  error: any;
  result!: any;
}

export class ListResponse extends ResponseResult {
  count: number | undefined;
}

export interface Currency {
  admin_fee_address: string;
  balance: number;
  contract_address: string;
  created_at: string;
  decimals: number;
  icon_url: string;
  id: number;
  name: string;
  network: string;
  symbol: string;
  updated_at: string;
}

export interface SubmitCollection {
  network: string;
  name: string;
  description: string;
  creator: string;
  contract_address: string;
  contact_info: string;
}