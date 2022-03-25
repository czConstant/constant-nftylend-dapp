import last from 'lodash/last';
import { Chain } from 'src/common/constants/network';
import api from 'src/common/services/apiClient';
import { LoanDataAsset } from 'src/modules/nftLend/models/api';
import { CollectionNft } from 'src/modules/nftLend/models/collection';
import { AssetNft, AssetNftDetail } from 'src/modules/nftLend/models/nft';
import { getLinkSolScanExplorer } from '../utils';

export class SolanaNft extends AssetNft {
  static parse(item: any): SolanaNft {
    let nft = new SolanaNft();
    nft.id = item.mint;
    nft.contract_address = item.mint;
    nft.name = item.data.name;
    nft.original_data = item;
    nft.detail_uri = item.data.uri;
    nft.owner = item.updateAuthoriy;
    return nft;
  }

  static parseFromLoanAsset(item: LoanDataAsset): SolanaNft {
    const nft = new SolanaNft();
    nft.id = item.contract_address;
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
    return !this.detail;
  }
  
  async fetchDetail(): Promise<any> {
    if (!this.detail_uri) throw new Error('No token uri');
    const response: any = await api.get(this.detail_uri);
    this.detail = {
      name: response.name,
      description: response.description,
      attributes: response.attributes,
      image: response.image,
    } as AssetNftDetail;
    this.creator = last(response?.properties?.creators)?.address
    return response;
  }

  getLinkExplorer(address?: string): string {
    return getLinkSolScanExplorer(address || String(this.id));
  }
}