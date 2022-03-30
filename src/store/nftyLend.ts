import { createSlice } from '@reduxjs/toolkit';
import { Chain } from 'src/common/constants/network';
import localStore from 'src/common/services/localStore';
import { RootState } from '.';

interface NftyLendState {
  needReload: number;
  wallet: {
    address: string;
    chain: Chain;
  },
  configs: {
    program_id: string,
    matic_nftypawn_address: string,
    avax_nftypawn_address: string,
  };
}

const initialState: NftyLendState = {
  needReload: 0,
  wallet: {
    address: '',
    chain: Chain.None,
  },
  configs: {
    program_id: '',
    matic_nftypawn_address: '',
    avax_nftypawn_address: '',
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
        localStore.save('walletAddress', action.payload.address);
      }
      if (action.payload.chain) {
        state.wallet.chain = action.payload.chain;
        localStore.save('walletChain', action.payload.chain);
      }
    },
    clearWallet: (state) => {
      state.wallet.address = '';
      state.wallet.chain = Chain.None;
      localStore.remove('walletAddress');
      localStore.remove('walletChain');
    }
  },
});

export const { requestReload, updateConfigs, updateWallet, clearWallet } = slice.actions;

export const selectNftyLend = (state: RootState) => state.nftyLend;
export const selectCurrentWallet = (state: RootState) => state.nftyLend.wallet;

export default slice.reducer;