import { Chain } from 'src/common/constants/network';
import { parseNftFromLoanAsset } from '../utils';
import { CollectionData } from './api';
import { LoanNft } from './loan';
import { AssetNft } from './nft';

export class CollectionNft {
  id: number = 0;
  name: string = '';
  seo_url: string = '';
  token_url: string = '';
  description: string = '';
  listing_total: number = 0;
  total_listed: number = 0;
  avg24h_amount: number = 0;
  total_volume: number = 0;
  new_loan?: LoanNft;
  chain: Chain = Chain.None;
  random_asset?: AssetNft;
  verified: boolean = false;

  static parseFromApi(item: CollectionData): CollectionNft {
    let collection = new CollectionNft();
    collection.id = item.id;
    collection.name = item.name;
    collection.seo_url = item.seo_url;
    collection.description = item.description;
    collection.listing_total = item.listing_total;
    collection.total_listed = item.total_listed;
    collection.total_volume = item.total_volume;
    collection.avg24h_amount = item.avg24h_amount;
    collection.verified = item.verified;
    const chainValue = Object.keys(Chain).find(e => Chain[e] === item.network);
    collection.chain = Chain[chainValue];
    if (item.new_loan) {
      collection.new_loan = LoanNft.parseFromApi(item.new_loan);
    }
    return collection;
  }
}
