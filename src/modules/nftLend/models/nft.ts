import api from 'src/common/services/apiClient';

export type NftID = string | number;

export abstract class AssetNft {
  id: NftID;
  contract_address: string;
  name: string;
  collection: string;
  author: string;
  address: string;
  original_data?: any;
  detail?: any;
  detail_uri: string;

  constructor() {
    this.id = '';
    this.detail_uri = '';
    this.contract_address = '';
    this.name = '';
    this.address = '';
    this.collection = '';
    this.author = '';
  }

  abstract needFetchDetail(): boolean;

  fetchDetail() { };

  isEmpty(): boolean {
    return this.id === '';
  }

  abstract getLinkExplorer(): string;
}