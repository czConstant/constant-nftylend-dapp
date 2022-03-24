import { Chain } from 'src/common/constants/network';
import api from 'src/common/services/apiClient';
import { LoanDataAsset } from 'src/modules/nftLend/models/api';
import { CollectionNft } from 'src/modules/nftLend/models/collection';
import { AssetNft, AssetNftDetail } from 'src/modules/nftLend/models/nft';
import { getLinkPolygonExplorer } from '../utils';

export class PolygonNft extends AssetNft {
  static parse(item: any): PolygonNft {
    let nft = new PolygonNft();
    nft.id = item.id.tokenId;
    nft.name = item.title;
    nft.detail_uri = item.tokenUri.raw;
    nft.contract_address = item.contract.address;
    nft.original_data = item;
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
    const response: any = await api.get(this.detail_uri);
    this.detail = {
      name: response.name,
      description: response.description,
      attributes: response.attributes,
    } as AssetNftDetail;
    return response;
  }

  getLinkExplorer(address?: string): string {
    return getLinkPolygonExplorer(address || String(this.id));
  }
}