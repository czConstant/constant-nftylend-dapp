const localStore = {
  KEY_WALLET_ADDRESS: 'nfty_wallet_address',
  KEY_WALLET_CHAIN: 'nfty_wallet_chain',
  KEY_WALLET_NAME: 'nfty_wallet_name',

  KEY_NEAR_NFT_CONTRACT: 'nfty_near_nft_contract',
  KEY_NEAT_NFT_TOKEN_ID: 'nfty_near_nft_token_id',

  save: function(key: string, value: any) {
    return localStorage.setItem(key, value);
  },
  get: function(key: string): any {
    return localStorage.getItem(key);
  },
  remove: function(key: string): any {
    return localStorage.removeItem(key);
  },
}

export default localStore;