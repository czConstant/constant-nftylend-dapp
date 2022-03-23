import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';

interface NftLendState {
  needReload: number;
  walletAddress: string;
  walletNetwork: number | string;
  configs: {
    program_id: string,
  };
}

const initialState: NftLendState = {
  needReload: 0,
  walletAddress: '',
  walletNetwork: '',
  configs: {
    program_id: '',
  },
};

const slice = createSlice({
  name: 'nftLend',
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
      state.walletNetwork = action.payload.network;
    },
    clearWallet: (state) => {
      state.walletAddress = '';
      state.walletNetwork = '';
    }
  },
});

export const { requestReload, updateConfigs, updateWallet, clearWallet } = slice.actions;

export const selectNftLend = (state: RootState) => state.nftLend;

export default slice.reducer;