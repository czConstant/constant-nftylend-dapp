export const APP_ENV = DOT_ENV;
export const API_BASE = APP_ENV.REACT_MCT_ROOT;
export const BASE_PATH = APP_ENV.REACT_BASE_PATH;

export const APP_URL = {
  HOME: `${BASE_PATH}/`,
  NFT_LENDING: `${BASE_PATH}/discover`,
  NFT_LENDING_MY_NFT: `${BASE_PATH}/my-nft`,
  NFT_LENDING_LIST_LOAN: `${BASE_PATH}/loans`,
  NFT_LENDING_DETAIL_LOAN: `${BASE_PATH}/loans/:id`,
}

export const API_URL = {
  NFT_LEND: {
    COLLECTIONS: `${API_BASE}/nfty-lend-api/collections/list`,
    COLLECTION_BY_ID: `${API_BASE}/nfty-lend-api/collections/detail`,
    ALL_LISTING_LOANS: `${API_BASE}/nfty-lend-api/loans/listing`,
    GET_LOANS: `${API_BASE}/nfty-lend-api/loans/list`,
    GET_OFERS: `${API_BASE}/nfty-lend-api/loans/offers`,
    LOANS_BY_ID: `${API_BASE}/nfty-lend-api/assets/detail`,
    LIST_CURRENCY: `${API_BASE}/nfty-lend-api/currencies/list`,
    UPDATE_BLOCK: `${API_BASE}/nfty-lend-api/blockchain/update-block`,
  }
}