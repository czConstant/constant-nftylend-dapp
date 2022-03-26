import { Chain } from 'src/common/constants/network';
import api from 'src/common/services/apiClient';
import { LoanDataAsset } from 'src/modules/nftLend/models/api';
import { CollectionNft } from 'src/modules/nftLend/models/collection';
import { AssetNft, AssetNftDetail } from 'src/modules/nftLend/models/nft';
import BigNumber from 'bignumber.js';
import { getLinkPolygonExplorer } from '../utils';
import { isUrl } from 'src/common/utils/helper';

export class PolygonNft extends AssetNft {
  static parse(item: any): PolygonNft {
    let nft = new PolygonNft();
    nft.id = new BigNumber(item.id.tokenId).toString();
    nft.name = item.title;
    nft.contract_address = item.contract.address;
    nft.original_data = item;
    if (!item.error || isUrl(item.tokenUri.raw)) nft.detail_uri = item.tokenUri.raw;
    return nft;
  }

  static parseFromLoanAsset(item: LoanDataAsset): PolygonNft {
    const nft = new PolygonNft();
    nft.id = item.contract_address;
    nft.name = item.name;
    nft.detail = { image: item.token_url } as AssetNftDetail;
    if (item.collection) {
      const collection = CollectionNft.parseFromApi(item.collection, Chain.Solana);
      if (collection) nft.collection = collection;
    }
    return nft;
  }

  needFetchDetail(): boolean {
    return !this.detail;
  }
  
  async fetchDetail() {
    if (!this.detail_uri) throw new Error('No token uri');
    const response: any = await api.get(this.detail_uri);
    this.detail = {
      name: response.name,
      description: response.description,
      attributes: response.attributes,
      image: response.image,
    } as AssetNftDetail;
    return response;
  }

  getLinkExplorer(address?: string): string {
    return getLinkPolygonExplorer(address || String(this.id));
  }
}