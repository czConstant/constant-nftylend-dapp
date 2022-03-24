import api from 'src/common/services/apiClient';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { getLinkPolygonExplorer } from '../utils';

export class PolygonNft extends AssetNft {
  static parse(item: any): PolygonNft {
    let nft = new PolygonNft();
    nft.id = item.id.tokenId;
    nft.name = item.title;
    nft.detail_uri = item.tokenUri.raw;
    nft.author = item.updateAuthoriy;
    nft.contract_address = item.contract.address;
    nft.original_data = item;
    return nft;
  }

  needFetchDetail(): boolean {
    return !this.detail;
  }
  
  async fetchDetail() {
    const response = await api.get(this.detail_uri);
    this.detail = response;
    return response;
  }

  getLinkExplorer(): string {
    return getLinkPolygonExplorer(String(this.id));
  }
}