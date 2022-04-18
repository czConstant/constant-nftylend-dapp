import { Chain } from 'src/common/constants/network';
import api from 'src/common/services/apiClient';
import { LoanDataAsset } from 'src/modules/nftLend/models/api';
import { CollectionNft } from 'src/modules/nftLend/models/collection';
import { AssetNft, AssetNftDetail } from 'src/modules/nftLend/models/nft';
import { getLinkEvmExplorer } from '../utils';

export class EvmNft extends AssetNft {
  static parse(item: any, chain?: Chain): EvmNft {
    let nft = new EvmNft();
    nft.id = item.id;
    nft.token_id = item.token_id;
    nft.contract_address = item.token_address;
    nft.detail_uri = item.token_uri;
    nft.original_data = item;
    if (chain) nft.chain = chain;
    try {
      const parsed = JSON.parse(item.metadata);
      nft.name = parsed.name;
      nft.detail = {
        name: parsed.name,
        description: parsed.description,
        image: parsed.image || parsed.animation_url,
        attributes: parsed.attributes || parsed.animation_url,
      } as AssetNftDetail;
    } catch (err) {

    }
    return nft;
  }

  static parseFromLoanAsset(item: LoanDataAsset, chain: Chain): EvmNft {
    const nft = new EvmNft();
    nft.id = item.id;
    nft.contract_address = item.contract_address;
    nft.name = item.name;
    nft.token_id = item.token_id;
    nft.chain = chain;
    nft.detail = { image: item.token_url, attributes: item.attributes } as AssetNftDetail;
    if (item.collection) {
      const collection = CollectionNft.parseFromApi(item.collection, Chain.Solana);
      if (collection) nft.collection = collection;
    }
    return nft;
  }

  needFetchDetail(): boolean {
    return !this.detail || !this.detail.image;
  }
  
  async fetchDetail(): Promise<any> {
    if (!this.detail_uri) throw new Error('No token uri');
    const response: any = await api.get(this.detail_uri);
    this.name = response.name;
    this.detail = {
      name: response.name,
      description: response.description,
      attributes: response.attributes,
      image: response.image || response.animation_url,
    } as AssetNftDetail;
    return this.detail;
  }

  getLinkExplorer(address?: string): string {
    return getLinkEvmExplorer(address || String(this.contract_address), this.chain);
  }
}