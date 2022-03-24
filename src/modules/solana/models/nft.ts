import api from 'src/common/services/apiClient';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { getLinkSolScanExplorer } from '../utils';

export class SolanaNft extends AssetNft {
  static parse(item: any): SolanaNft {
    let nft = new SolanaNft();
    nft.id = item.mint;
    nft.name = item.data.name;
    nft.original_data = item;
    nft.detail_uri = item.data.uri;
    nft.author = item.updateAuthoriy;
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
    return getLinkSolScanExplorer(String(this.id));
  }
}