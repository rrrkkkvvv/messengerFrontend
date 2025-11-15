import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICallUI {
  isCollapsed: boolean;
}

const initialState: ICallUI = {
  isCollapsed: false,
};

const callUISlice = createSlice({
  name: "callUIState",
  initialState,
  reducers: {
    toggleIsCallCollapsed(state) {
      state.isCollapsed = !state.isCollapsed;
    },
    setIsCallCollapsed(state, action: PayloadAction<boolean>) {
      state.isCollapsed = action.payload;
    },
  },
  selectors: {
    selectIsCallCollapsed: (state) => state.isCollapsed,
  },
});

export const { toggleIsCallCollapsed, setIsCallCollapsed } =
  callUISlice.actions;
export const { selectIsCallCollapsed } = callUISlice.selectors;
const callUiReducer = callUISlice.reducer;
export default callUiReducer;
