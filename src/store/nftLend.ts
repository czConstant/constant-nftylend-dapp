import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';

interface NftLendState {
  needReload: number;
  configs: {
    program_id: string,
  };
}

const initialState: NftLendState = {
  needReload: 0,
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
  },
});

export const { requestReload, updateConfigs } = slice.actions;

export const selectNftLend = (state: RootState) => state.nftLend;

export default slice.reducer;