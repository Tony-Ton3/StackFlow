import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSavedStack: null,
  error: null,
  loading: false,
};

const savedstackSlice = createSlice({
  name: "savedStack",
  initialState,
  reducers: {
    setSavedStackStart: (state) => {
      state.loading = false;
      state.error = null;
    },
    setSavedStackSuccess: (state, action) => {
      state.currentSavedStack = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSavedStackFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setSavedStackStart,
  setSavedStackSuccess,
  setSavedStackFailure,
} = savedstackSlice.actions;

export default savedstackSlice.reducer;
