import { Chain } from 'src/common/constants/network';
import { AssetStatData } from './api';
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
  origin_token_id: string = '';
  chain: Chain = Chain.None;
  stats?: AssetStatData;

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
  mime_type: string;
}

export interface AssetNftAttribute {
  trait_type: string;
  value: string;
}
