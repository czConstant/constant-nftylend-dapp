import { createSlice } from '@reduxjs/toolkit';
import React from 'react';
import { RootState } from '.';

interface LoadingOverlayState {
  show: boolean;
  message?: React.ReactNode;
  timeout?: number;
  callback?: Function;
}

const initialState: LoadingOverlayState = {
  show: false,
  message: '',
  timeout: 0,
}

const slice = createSlice({
  name: 'loadingOverlay',
  initialState,
  reducers: {
    showLoadingOverlay: (state) => {
      state.show = true;
    },
    openLoadingOverlay: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.timeout = action.payload.timeout;
      state.callback = action.payload.callback;
    },
    hideLoadingOverlay: (state) => {
      state.show = false;
    },
  },
});

export const { showLoadingOverlay, openLoadingOverlay, hideLoadingOverlay } = slice.actions

export const selectLoadingOverlay = (state: RootState) => state.loadingOverlay;

export default slice.reducer;