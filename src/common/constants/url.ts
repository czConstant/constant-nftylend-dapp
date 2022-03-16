export const APP_ENV = DOT_ENV;
export const MCT_ROOT = APP_ENV.REACT_MCT_ROOT;
export const BASE_PATH = APP_ENV.REACT_BASE_PATH;
export const MCT_API_BASE = APP_ENV.REACT_MCT_API_BASE;

export const APP_URL = {
  HOME: `${BASE_PATH}/`,
  NFT_LENDING: `${BASE_PATH}/discover`,
  NFT_LENDING_MY_NFT: `${BASE_PATH}/my-nft`,
  NFT_LENDING_LIST_LOAN: `${BASE_PATH}/loans`,
  NFT_LENDING_DETAIL_LOAN: `${BASE_PATH}/loans/:id`,
  NFT_LENDING_SUBMIT_WHITELIST: `${BASE_PATH}/submit`,
  NFT_LENDING_TERM_OF_SERVICE: `${BASE_PATH}/terms-of-service`,
}

export const API_URL = { 
  NFT_LEND: {
    GET_SYSTEM_CONFIGS: `${MCT_ROOT}${MCT_API_BASE}/configs`,
    COLLECTIONS: `${MCT_ROOT}${MCT_API_BASE}/collections/list`,
    COLLECTION_BY_ID: `${MCT_ROOT}${MCT_API_BASE}/collections/detail`,
    ALL_LISTING_LOANS: `${MCT_ROOT}${MCT_API_BASE}/loans/listing`,
    GET_LOANS: `${MCT_ROOT}${MCT_API_BASE}/loans/list`,
    GET_OFERS: `${MCT_ROOT}${MCT_API_BASE}/loans/offers`,
    LOANS_BY_ID: `${MCT_ROOT}${MCT_API_BASE}/assets/detail`,
    LIST_CURRENCY: `${MCT_ROOT}${MCT_API_BASE}/currencies/list`,
    UPDATE_BLOCK: `${MCT_ROOT}${MCT_API_BASE}/blockchain/update-block`,
    VERIFY_ASSET: `${MCT_ROOT}${MCT_API_BASE}/collections/verified`,
    LOAN_TRANSACTION: `${MCT_ROOT}${MCT_API_BASE}/loans/transactions`,
    SALE_TRANSACTION: `${MCT_ROOT}${MCT_API_BASE}/assets/transactions`,
    SUBMIT_COLLECTION: `${MCT_ROOT}${MCT_API_BASE}/collections/submitted`,
  }
}