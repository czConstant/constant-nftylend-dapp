import { createSlice } from '@reduxjs/toolkit';
import { NftItem } from 'src/modules/nftBridge/components/nftSelector/selector';
import { ChainInfo } from 'src/modules/nftBridge/constant';
import { RootState } from '.';

interface NftBridgeState {
  sourceChain?: ChainInfo;
  targetChain?: ChainInfo;
  sourceNft?: NftItem;
}

const initialState: NftBridgeState = {
  sourceChain: undefined,
  targetChain: undefined,
  sourceNft: undefined,
};

const slice = createSlice({
  name: 'nftBridge',
  initialState,
  reducers: {
    updateSourceChain: (state, action) => {
      state.sourceChain = action.payload;
    },
    updateTargetChain: (state, action) => {
      state.targetChain = action.payload;
    },
    updateSourceNft: (state, action) => {
      state.sourceNft = action.payload;
    },
  },
});

export const { updateSourceChain, updateTargetChain, updateSourceNft } = slice.actions;

export const selectNftBridge = (state: RootState) => state.nftBridge;

export default slice.reducer;