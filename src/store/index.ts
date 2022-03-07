import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import modal from './modal';
import nftLend from './nftLend';
import loadingOverlay from './loadingOverlay';
import nftSlice from 'src/modules/nftBridge/store/nftSlice';
import attestSlice from 'src/modules/nftBridge/store/attestSlice';
import tokenSlice from 'src/modules/nftBridge/store/tokenSlice';

const reducer = combineReducers({
  modal,
  loadingOverlay,
  nftLend,
  nftSlice,
  attestSlice,
  tokenSlice,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['modal/openModal'],
    },
  }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;