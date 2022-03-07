import { createSlice } from '@reduxjs/toolkit';
import { ModalComponentProps } from 'src/common/components/modal/ModalComponentInterface';
import { RootState } from '.';

interface ModalState {
  modals: Array<ModalComponentProps>;
}

const initialState: ModalState = {
  modals: []
}

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.modals = state.modals.concat(action.payload);
    },
    closeModal: (state, action) => {
      const payload = action.payload;
      if (payload.id !== 0) {
        state.modals = payload.id
          ? state.modals.filter((e) => e.id !== payload.id)
          : state.modals.slice(0, -1);
      }
    },
  },
});

export const { openModal, closeModal } = slice.actions

export const selectModals = (state: RootState) => state.modal;

export default slice.reducer;