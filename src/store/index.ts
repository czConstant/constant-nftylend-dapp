import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import modal from './modal';
import nftyLend from './nftyLend';
import loadingOverlay from './loadingOverlay';

const reducer = combineReducers({
  modal,
  nftyLend,
  loadingOverlay,
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