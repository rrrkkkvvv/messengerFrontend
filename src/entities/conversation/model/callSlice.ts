import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TCallStatus, TEndCallReason } from "../api/callTypes";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { AppDispatch, RootState } from "../../../app/store/store";
interface ICallSliceProps {
  callStatus: TCallStatus;
  endReason: TEndCallReason;
  callFrom: string | null;
  callTo: string | null;
  interlocuter: TUserInfo | null;
}

const initialState: ICallSliceProps = {
  callStatus: "idle",
  endReason: null,
  callFrom: null,
  callTo: null,
  interlocuter: null,
};

const callSlice = createSlice({
  name: "callState",
  initialState,
  reducers: {
    resetCallState(state) {
      state.callStatus = "idle";
      state.callFrom = null;
      state.callTo = null;
      state.interlocuter = null;
    },

    setCallStatus(state, action: PayloadAction<TCallStatus>) {
      state.callStatus = action.payload;
    },
    setCallTo(state, action: PayloadAction<string>) {
      state.callTo = action.payload;
      state.callStatus = "outgoing";
    },
    setCallFrom(state, action: PayloadAction<string>) {
      state.callFrom = action.payload;
    },
    setInterlocuter(state, action: PayloadAction<TUserInfo>) {
      state.interlocuter = action.payload;
    },
    setCallEndReason(state, action: PayloadAction<TEndCallReason>) {
      state.endReason = action.payload;
    },
  },
  selectors: {
    selectCallTo: (state) => state.callTo,
    selectCallEndReason: (state) => state.endReason,
    selectCallFrom: (state) => state.callFrom,
    selectCallStatus: (state) => state.callStatus,
    selectInterlocuter: (state) => state.interlocuter,
  },
});

export const {
  resetCallState,
  setCallFrom,
  setCallStatus,
  setCallTo,
  setInterlocuter,
  setCallEndReason,
} = callSlice.actions;
export const callUserThunk =
  (user: TUserInfo) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      callState: { callStatus },
    } = getState();
    if (callStatus !== "idle") return;
    dispatch(setCallStatus("outgoing"));
    dispatch(setCallTo(user._id));
    dispatch(setInterlocuter(user));
  };

export const {
  selectCallTo,
  selectCallFrom,
  selectCallStatus,
  selectInterlocuter,
  selectCallEndReason,
} = callSlice.selectors;
const callReducer = callSlice.reducer;
export default callReducer;
