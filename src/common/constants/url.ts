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
    COLLECTIONS: `${API_BASE}/api/collections/list`,
    COLLECTION_BY_ID: `${API_BASE}/api/collections/detail`,
    ALL_LISTING_LOANS: `${API_BASE}/api/loans/listing`,
    GET_LOANS: `${API_BASE}/api/loans/list`,
    GET_OFERS: `${API_BASE}/api/loans/offers`,
    LOANS_BY_ID: `${API_BASE}/api/assets/detail`,
    LIST_CURRENCY: `${API_BASE}/api/currencies/list`,
    UPDATE_BLOCK: `${API_BASE}/api/blockchain/update-block`,
  }
}