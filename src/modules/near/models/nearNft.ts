import { Chain } from 'src/common/constants/network';
import api from 'src/common/services/apiClient';
import { LoanDataAsset } from 'src/modules/nftLend/models/api';
import { CollectionNft } from 'src/modules/nftLend/models/collection';
import { AssetNft, AssetNftDetail } from 'src/modules/nftLend/models/nft';
import { getUrlWithIpfsDefault } from 'src/modules/nftLend/utils';
import { getLinkNearExplorer } from '../utils';

export class NearNft extends AssetNft {
  chain: Chain = Chain.Near;

  static parse(item: any): NearNft {
    let nft = new NearNft();
    nft.id = item.id;
    nft.contract_address = item.contract_address;
    nft.token_id = item.token_id;
    nft.name = item.metadata.title;
    nft.original_data = item;
    nft.owner = item.owner_id;
    nft.detail_uri = getUrlWithIpfsDefault(item.metadata.reference);
    nft.detail = {
      name: item.metadata.title,
      description: item.metadata.description,
      image: item.metadata.media,
    } as AssetNftDetail;
    return nft;
  }

  static parseFromLoanAsset(item: LoanDataAsset): NearNft {
    const nft = new NearNft();
    nft.id = item.id;
    nft.token_id = item.token_id;
    nft.contract_address = item.contract_address;
    nft.name = item.name;
    nft.origin_contract_address = item.origin_contract_address;
    nft.origin_contract_network = item.origin_contract_network;
    nft.detail = { image: item.token_url, attributes: item.attributes } as AssetNftDetail;
    if (item.collection) {
      const collection = CollectionNft.parseFromApi(item.collection, Chain.Solana);
      if (collection) nft.collection = collection;
    }
    return nft;
  }

  needFetchDetail(): boolean {
    return !!this.detail_uri && (!this.detail || !this.detail.attributes);
  }

  async fetchDetail(): Promise<any> {
    if (!this.detail_uri) throw new Error('No token uri');
    const response: any = await api.get(this.detail_uri);

    if (!this.detail) this.detail = {} as AssetNftDetail;
    this.name = this.name || response.title;
    this.detail.description = response.desciption || this.detail.description;
    this.detail.attributes = response.attributes;
    return this.detail;
  }
  
  getLinkExplorer(address?: string): string {
    return getLinkNearExplorer(address || String(this.id));
  }
}