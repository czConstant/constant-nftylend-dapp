import { ChainId } from '../utils/wormhole';

export type MarketsMap = {
  markets?: {
    [index: string]: {
      name: string;
      link: string;
    };
  };
  tokens?: {
    [key in ChainId]?: {
      [index: string]: {
        symbol: string;
        logo: string;
      };
    };
  };
  tokenMarkets?: {
    [key in ChainId]?: {
      [key in ChainId]?: {
        [index: string]: {
          symbol: string;
          logo: string;
          markets: string[];
        };
      };
    };
  };
};