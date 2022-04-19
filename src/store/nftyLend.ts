import { createSlice } from '@reduxjs/toolkit';
import * as nearAPI from 'near-api-js';

import { Chain } from 'src/common/constants/network';
import { CryptoWallet } from 'src/common/constants/wallet';
import localStore from 'src/common/services/localStore';
import { RootState } from '.';

interface NftyLendState {
  needReload: number;
  wallet: {
    address: string;
    chain: Chain;
    name: CryptoWallet;
  },
  configs: {
    program_id: string,
    matic_nftypawn_address: string,
    avax_nftypawn_address: string,
    bsc_nftypawn_address: string,
    boba_nftypawn_address: string,
    near_nftypawn_address: string,
  };
}

const initialState: NftyLendState = {
  needReload: 0,
  wallet: {
    address: '',
    chain: Chain.None,
    name: CryptoWallet.None,
  },
  configs: {
    program_id: '',
    matic_nftypawn_address: '',
    avax_nftypawn_address: '',
    bsc_nftypawn_address: '',
    boba_nftypawn_address: '',
    near_nftypawn_address: '',
  },
};

const slice = createSlice({
  name: 'nftyLend',
  initialState,
  reducers: {
    requestReload: (state) => {
      state.needReload += 1;
    },
    updateConfigs: (state, action) => {
      state.configs = action.payload;
    },
    updateWallet: (state, action) => {
      if (action.payload.address) {
        state.wallet.address = action.payload.address;
        localStore.save(localStore.KEY_WALLET_ADDRESS, action.payload.address);
      }
      if (action.payload.chain) {
        state.wallet.chain = action.payload.chain;
        localStore.save(localStore.KEY_WALLET_CHAIN, action.payload.chain);
      }
      if (action.payload.name) {
        state.wallet.name = action.payload.name;
        localStore.save(localStore.KEY_WALLET_NAME, action.payload.name);
      }
    },
    clearWallet: (state) => {
      state.wallet.address = '';
      state.wallet.chain = Chain.None;
      state.wallet.name = CryptoWallet.None;
      localStore.remove(localStore.KEY_WALLET_ADDRESS);
      localStore.remove(localStore.KEY_WALLET_CHAIN);
      localStore.remove(localStore.KEY_WALLET_NAME);
      window.evmProvider = null;

      window.nearAccount.signOut();
      window.near = null;
      window.nearInitPromise = null;
      window.nearAccount = null;
    }
  },
});

export const { requestReload, updateConfigs, updateWallet, clearWallet } = slice.actions;

export const selectNftyLend = (state: RootState) => state.nftyLend;
export const selectCurrentWallet = (state: RootState) => state.nftyLend.wallet;

export default slice.reducer;