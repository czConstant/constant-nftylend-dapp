import { Chain } from 'src/common/constants/network';
import { PolygonNft } from 'src/modules/polygon/models/polygonNft';
import { SolanaNft } from 'src/modules/solana/models/solanaNft';
import { LoanData, LoanDataAsset } from './api';
import { CollectionNft } from './collection';

export type NftID = string;

export abstract class AssetNft {
  id: NftID;
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

  constructor() {
    this.id = '';
  }

  abstract needFetchDetail(): boolean;
  abstract getLinkExplorer(address?: string): string;

  fetchDetail() { };

  isEmpty(): boolean { return this.id === ''; }
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
