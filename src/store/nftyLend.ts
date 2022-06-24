import { createSlice } from '@reduxjs/toolkit';

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
  userSettings: {
    email: string;
    is_verified: boolean;
    username: string;
    news_noti_enabled: boolean;
    loan_noti_enabled: boolean;
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
  userSettings: {
    email: '',
    username: '',
    is_verified: false,
    news_noti_enabled: true,
    loan_noti_enabled: true,
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
    updateUserSettings: (state, action) => {
      state.userSettings = {
        email: action.payload.email,
        is_verified: action.payload.is_verified,
        username: action.payload.username,
        news_noti_enabled: action.payload.news_noti_enabled,
        loan_noti_enabled: action.payload.loan_noti_enabled,
      }
    },
    clearUserSettings: (state) => {
      state.userSettings = initialState.userSettings
    },
    updateWallet: (state, action) => {
      if (action.payload.address) {
        state.wallet.address = action.payload.address.toLowerCase();
        localStore.save(localStore.KEY_WALLET_ADDRESS, action.payload.address.toLowerCase());
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

      if (window.nearSelector) {
        window.nearSelector.signOut();
      }
    }
  },
});

export const { requestReload, updateConfigs, updateWallet, clearWallet, updateUserSettings, clearUserSettings } = slice.actions;

export const selectNftyLend = (state: RootState) => state.nftyLend;
export const selectCurrentWallet = (state: RootState) => state.nftyLend.wallet;
export const selectUserSettings = (state: RootState) => state.nftyLend.userSettings;

export default slice.reducer;