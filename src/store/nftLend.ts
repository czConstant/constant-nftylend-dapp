import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';

interface NftLendState {
  needReload: number;
}

const initialState: NftLendState = {
  needReload: 0,
};

const slice = createSlice({
  name: 'nftLend',
  initialState,
  reducers: {
    requestReload: (state) => {
      state.needReload += 1;
    },
  },
});

export const { requestReload } = slice.actions

export const selectNftLend = (state: RootState) => state.nftLend;

export default slice.reducer;