import { NetworkModel } from "./network";

export class ItemNFTModel {
  id!: string;
  img!: string;
  duration!: string | number;
  title!: string;
  bid_price!: string;
  network!: NetworkModel;
}
