import { CollectionNft } from './collection';

export abstract class AssetNft {
  id: number = -1;
  token_id: string = '';
  contract_address: string = '';
  name: string = '';
  collection?: CollectionNft;
  owner: string = '';
  creator: string = '';
  original_data?: any;
  detail?: AssetNftDetail;
  detail_uri: string = '';
  origin_contract_network: string = '';
  origin_contract_address: string = '';

  abstract needFetchDetail(): boolean;
  abstract getLinkExplorer(address?: string): string;

  fetchDetail() { };

  isEmpty(): boolean { return this.id === -1; }
}

export interface AssetNftDetail {
  name: string;
  description: string;
  image: string;
  attributes: AssetNftAttribute;
  seller_fee_rate: number;
}

export interface AssetNftAttribute {
  trait_type: string;
  value: string;
}
