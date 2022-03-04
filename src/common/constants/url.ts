export const APP_ENV = DOT_ENV;
export const API_BASE = APP_ENV.REACT_MCT_ROOT;

export const APP_URL = {
  HOME: '/',
  NFT_LENDING: '/nft-lending',
  NFT_LENDING_MY_NFT: '/nft-lending/my-nft',
  NFT_LENDING_LIST_LOAN: '/nft-lending/loans',
}

export const API_URL = {
  NFT_LEND: {
    COLLECTIONS: `${API_BASE}/nfty-lend-api/collections/list`,
    LIST_CURRENCY: `${API_BASE}/nfty-lend-api/currencies/list`,
    UPDATE_BLOCK: `${API_BASE}/nfty-lend-api/update-block`,
    ALL_LISTING_LOANS: `${API_BASE}/nfty-lend-api/loans/listing`,
  }
}