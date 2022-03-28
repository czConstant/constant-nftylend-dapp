import { createSlice } from '@reduxjs/toolkit';
import { Chain } from 'src/common/constants/network';
import { RootState } from '.';

interface NftyLendState {
  needReload: number;
  walletAddress: string;
  walletChain: Chain;
  configs: {
    program_id: string,
    matic_nftypawn_address: string,

  };
}

const initialState: NftyLendState = {
  needReload: 0,
  walletAddress: '',
  walletChain: Chain.None,
  configs: {
    program_id: '',
    matic_nftypawn_address: '',
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
      state.walletAddress = action.payload.address;
      state.walletChain = action.payload.network;
    },
    clearWallet: (state) => {
      state.walletAddress = '';
      state.walletChain = Chain.None;
    }
  },
});

export const { requestReload, updateConfigs, updateWallet, clearWallet } = slice.actions;

export const selectNftyLend = (state: RootState) => state.nftyLend;

export default slice.reducer;