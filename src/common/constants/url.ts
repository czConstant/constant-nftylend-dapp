import { BASE_PATH, MCT_API_BASE, MCT_ROOT } from './config'

export const DISCORD_URL = 'https://discord.gg/dyMrkSXyq7';

export const APP_URL = {
  HOME: `${BASE_PATH}/`,
  NFT_LENDING: `${BASE_PATH}/discover`,
  NFT_LENDING_MY_NFT: `${BASE_PATH}/my-nft`,
  NFT_LENDING_LIST_LOAN: `${BASE_PATH}/loans`,
  NFT_LENDING_DETAIL_LOAN: `${BASE_PATH}/loans/:id`,
  NFT_LENDING_SUBMIT_WHITELIST: `${BASE_PATH}/submit`,
  NFT_LENDING_TERM_OF_SERVICE: `${BASE_PATH}/terms-of-service`,
  NFT_LENDING_FAQS: `${BASE_PATH}/help`,
  NFT_LENDING_BLOG: `${BASE_PATH}/news/`,
  NFT_LENDING_VOTING: `${BASE_PATH}/voting/`,
}

export const API_URL = { 
  NFT_LEND: {
    GET_SYSTEM_CONFIGS: `${MCT_ROOT}${MCT_API_BASE}/configs`,
    COLLECTIONS: `${MCT_ROOT}${MCT_API_BASE}/collections/list`,
    COLLECTION_BY_ID: `${MCT_ROOT}${MCT_API_BASE}/collections/detail`,
    ALL_LISTING_LOANS: `${MCT_ROOT}${MCT_API_BASE}/loans/listing`,
    GET_LOANS: `${MCT_ROOT}${MCT_API_BASE}/loans/list`,
    GET_OFERS: `${MCT_ROOT}${MCT_API_BASE}/loans/offers`,
    ASSET_BY_SEO: `${MCT_ROOT}${MCT_API_BASE}/assets/detail`,
    ASSET_INFO: `${MCT_ROOT}${MCT_API_BASE}/assets/info`,
    LIST_CURRENCY: `${MCT_ROOT}${MCT_API_BASE}/currencies/list`,
    UPDATE_BLOCK_SOL: `${MCT_ROOT}${MCT_API_BASE}/blockchain/update-block`,
    VERIFY_ASSET: `${MCT_ROOT}${MCT_API_BASE}/collections/verified`,
    LOAN_TRANSACTION: `${MCT_ROOT}${MCT_API_BASE}/loans/transactions`,
    SALE_TRANSACTION: `${MCT_ROOT}${MCT_API_BASE}/assets/transactions`,
    SUBMIT_COLLECTION: `${MCT_ROOT}${MCT_API_BASE}/collections/submitted`,
    CREATE_LOAN: `${MCT_ROOT}${MCT_API_BASE}/loans/create`,
    CREATE_OFFER: `${MCT_ROOT}${MCT_API_BASE}/loans/offers/create`,
    UPDATE_BLOCK_EVM: `${MCT_ROOT}${MCT_API_BASE}/blockchain/{network}/scan-block`,
    SYNC_NEAR: `${MCT_ROOT}${MCT_API_BASE}/loans/near/sync`,
    BORROWER_STATS: `${MCT_ROOT}${MCT_API_BASE}/loans/borrower-stats`,
    USER_SETTINGS: `${MCT_ROOT}${MCT_API_BASE}/users/settings`,
    GET_OWNED_NFTS: `${MCT_ROOT}${MCT_API_BASE}/moralis/{owner}/nft`,
  },
}

// export const ALCHEMY_URL = {
//   GET_NFTS: APP_CLUSTER === 'mainnet' ? '' : `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}/getNFTs/`,
//   GET_NFT_METADATA: APP_CLUSTER === 'mainnet' ? '' : `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}/getNFTMetadata/`,
// }

// export const MORALIS_URL = {
//   GET_NFTS: `https://deep-index.moralis.io/api/v2/{owner}/nft`,
// }