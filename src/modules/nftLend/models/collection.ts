import { Chain } from 'src/common/constants/network';
import { PolygonNft } from 'src/modules/polygon/models/polygonNft';
import { SolanaNft } from 'src/modules/solana/models/solanaNft';
import { CollectionData } from './api';
import { AssetNft } from './nft';

export class CollectionNft {
  id: number = 0;
  name: string = '';
  seo_url: string = '';
  token_url: string = '';
  description: string = '';
  listing_total: number = 0;
  total_listed: number = 0;
  avg24h_amount: string = '';
  total_volume: string = '';
  listing_asset?: AssetNft;

  static parseFromApi(item: CollectionData, chain?: Chain): CollectionNft {
    let collection = new CollectionNft();
    collection.id = item.id;
    collection.name = item.name;
    collection.seo_url = item.seo_url;
    collection.description = item.description;
    collection.listing_total = item.listing_total;
    collection.total_listed = item.total_listed;
    collection.total_volume = item.total_volume;
    if (item.listing_asset) {
      if (chain === Chain.Solana) {
        collection.listing_asset = SolanaNft.parseFromLoanAsset(item.listing_asset);
      } else {
        collection.listing_asset = PolygonNft.parseFromLoanAsset(item.listing_asset);
      }
    }
    return collection;
  }
}
