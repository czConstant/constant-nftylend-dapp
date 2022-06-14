import { BASE_PATH, MCT_API_BASE, MCT_ROOT } from './config'

export const DISCORD_URL = 'https://discord.gg/dyMrkSXyq7';
export const TWITTER_URL = 'https://twitter.com/pawnprotocol';
export const GITBOOK_URL = 'https://docs.nftpawn.financial/';

export const APP_URL = {
  HOME: `${BASE_PATH}/`,
  PAWN_PROTOCOL: `${BASE_PATH}/pawn-protocol`,
  DISCOVER: `${BASE_PATH}/discover`,
  MY_NFT: `${BASE_PATH}/my-nft`,
  LIST_LOAN: `${BASE_PATH}/loans`,
  DETAIL_LOAN: `${BASE_PATH}/loans/:id`,
  SUBMIT_WHITELIST: `${BASE_PATH}/submit`,
  TERM_OF_SERVICE: `${BASE_PATH}/terms-of-service`,
  FAQS: `${BASE_PATH}/help`,
  NFT_PAWN_BLOG: `${BASE_PATH}/news/`,
  DASHBOARD: `${BASE_PATH}/dashboard`,
  VOTING: `${BASE_PATH}/voting/`,
  VOTING_PROPOSAL_MAKE: `${BASE_PATH}/voting/proposal/make`,
  VOTING_DETAIL: `${BASE_PATH}/voting/proposal/detail`,
}

export const API_URL = { 
  NFT_LEND: {
    GET_SYSTEM_CONFIGS: `${MCT_ROOT}${MCT_API_BASE}/configs`,
    COLLECTIONS: `${MCT_ROOT}${MCT_API_BASE}/collections/list`,
    COLLECTION_BY_ID: `${MCT_ROOT}${MCT_API_BASE}/collections/detail`,
    ALL_LISTING_LOANS: `${MCT_ROOT}${MCT_API_BASE}/loans/listing`,
    GET_LOANS: `${MCT_ROOT}${MCT_API_BASE}/loans/list`,
    GET_OFERS: `${MCT_ROOT}${MCT_API_BASE}/loans/offers`,
    PLATFORM_STATS: `${MCT_ROOT}${MCT_API_BASE}/loans/platform-stats`,
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
    USER_STATS: `${MCT_ROOT}${MCT_API_BASE}/users/stats`,
    GET_OWNED_NFTS: `${MCT_ROOT}${MCT_API_BASE}/moralis/{owner}/nft`,
    PWP_BALANCES: `${MCT_ROOT}${MCT_API_BASE}/users/balances/pwp`,
    PWP_CLAIM: `${MCT_ROOT}${MCT_API_BASE}/users/balances/claim`,
    BALANCES_TRANSACTIONS: `${MCT_ROOT}${MCT_API_BASE}/users/balances/transactions`,

    VOTING_CURRENCIES: `${MCT_ROOT}${MCT_API_BASE}/currencies/pwp-token`,
    VOTING_PROPOSAL: `${MCT_ROOT}${MCT_API_BASE}/proposals/create`,
    VOTING_PROPOSAL_LIST: `${MCT_ROOT}${MCT_API_BASE}/proposals/list`,
    VOTING_PROPOSAL_DETAIL: `${MCT_ROOT}${MCT_API_BASE}/proposals/detail`,
    VOTING_PROPOSAL_DETAIL_VOTES: `${MCT_ROOT}${MCT_API_BASE}/proposals/votes/list`,
    VOTING_PROPOSAL_VOTE_CREATE: `${MCT_ROOT}${MCT_API_BASE}/proposals/votes/create`,
    VOTING_PROPOSAL_VOTE_CHECK: `${MCT_ROOT}${MCT_API_BASE}/proposals/votes/vote`,
  },
}