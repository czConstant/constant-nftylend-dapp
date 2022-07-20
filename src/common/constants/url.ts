import { BASE_PATH, MCT_API_BASE, MCT_ROOT } from './config'

export const DISCORD_URL = 'https://discord.nftpawn.financial/';
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
  DASHBOARD: `${BASE_PATH}/my-assets`,
  VOTING: `${BASE_PATH}/proposal/`,
  VOTING_PROPOSAL_MAKE: `${BASE_PATH}/proposal/make`,
  VOTING_DETAIL: `${BASE_PATH}/proposal/detail`,
  APPLY_AFFILIATE: `${BASE_PATH}/apply-affiliate`,
  VERIFY_EMAIL: `${BASE_PATH}/verify-email`,
  LEADERBOARD: `${BASE_PATH}/leaderboard`,
  BORROWER: `${BASE_PATH}/borrower`,
  LENDER: `${BASE_PATH}/lender`,
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
    NEAR_WHITELIST_COLLECTIONS: `${MCT_ROOT}${MCT_API_BASE}/collections/near-whitelist-collections`,
    LOAN_TRANSACTION: `${MCT_ROOT}${MCT_API_BASE}/loans/transactions`,
    SALE_TRANSACTION: `${MCT_ROOT}${MCT_API_BASE}/assets/transactions`,
    SUBMIT_COLLECTION: `${MCT_ROOT}${MCT_API_BASE}/collections/submitted`,
    CREATE_LOAN: `${MCT_ROOT}${MCT_API_BASE}/loans/create`,
    CREATE_OFFER: `${MCT_ROOT}${MCT_API_BASE}/loans/offers/create`,
    UPDATE_BLOCK_EVM: `${MCT_ROOT}${MCT_API_BASE}/blockchain/{network}/scan-block`,
    SYNC_NEAR: `${MCT_ROOT}${MCT_API_BASE}/loans/near/sync`,

    BORROWER_STATS: `${MCT_ROOT}${MCT_API_BASE}/loans/borrower-stats`,
    LENDER_STATS: `${MCT_ROOT}${MCT_API_BASE}/loans/lender-stats`,
    
    USER_SETTINGS: `${MCT_ROOT}${MCT_API_BASE}/users/settings`,
    USER_STATS: `${MCT_ROOT}${MCT_API_BASE}/users/stats`,
    USER_CONNECTED: `${MCT_ROOT}${MCT_API_BASE}/users/connected`,

    GET_OWNED_NFTS: `${MCT_ROOT}${MCT_API_BASE}/moralis/{owner}/nft`,
    PWP_BALANCES: `${MCT_ROOT}${MCT_API_BASE}/users/balances/pwp`,
    NEAR_BALANCES: `${MCT_ROOT}${MCT_API_BASE}/users/balances/near`,
    PWP_CLAIM: `${MCT_ROOT}${MCT_API_BASE}/users/balances/claim`,
    BALANCES_TRANSACTIONS: `${MCT_ROOT}${MCT_API_BASE}/users/balances/transactions`,

    VERIFY_EMAIL: `${MCT_ROOT}${MCT_API_BASE}/verifications/verify-email`,
    VERIFY_TOKEN: `${MCT_ROOT}${MCT_API_BASE}/verifications/verify-token`,

    VOTING_CURRENCIES: `${MCT_ROOT}${MCT_API_BASE}/currencies/pwp-token`,
    VOTING_PROPOSAL: `${MCT_ROOT}${MCT_API_BASE}/proposals/create`,
    VOTING_PROPOSAL_LIST: `${MCT_ROOT}${MCT_API_BASE}/proposals/list`,
    VOTING_PROPOSAL_DETAIL: `${MCT_ROOT}${MCT_API_BASE}/proposals/detail`,
    VOTING_PROPOSAL_DETAIL_VOTES: `${MCT_ROOT}${MCT_API_BASE}/proposals/votes/list`,
    VOTING_PROPOSAL_VOTE_CREATE: `${MCT_ROOT}${MCT_API_BASE}/proposals/votes/create`,
    VOTING_PROPOSAL_VOTE_CHECK: `${MCT_ROOT}${MCT_API_BASE}/proposals/votes/vote`,

    AFFILIATE_STATS: `${MCT_ROOT}${MCT_API_BASE}/affiliates/stats`,
    AFFILIATE_VOLUMES: `${MCT_ROOT}${MCT_API_BASE}/affiliates/volumes`,
    AFFILIATE_TRANSACTIONS: `${MCT_ROOT}${MCT_API_BASE}/affiliates/transactions`,
    APPLY_AFFILIATE: `${MCT_ROOT}${MCT_API_BASE}/affiliates/submitted`,

    NOTIFICATION_LIST: `${MCT_ROOT}${MCT_API_BASE}/notifications/list`,
    NOTIFICATION_SEEN: `${MCT_ROOT}${MCT_API_BASE}/notifications/seen`,

    LEADERBOARD: `${MCT_ROOT}${MCT_API_BASE}/loans/leaderboard`,
  },
}