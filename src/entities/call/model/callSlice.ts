import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../../app/store/store";
import { defaultMediaState } from "../../../shared/values/mediaStateConfig";
import { TMediaState } from "../../../shared/types/callTypes";
import {
  TCallParticipant,
  TCallStatus,
  TEndCallReason,
} from "../api/callTypes";

interface ICallSliceProps {
  mediaState: TMediaState;
  callStatus: TCallStatus;
  endReason: TEndCallReason;
  callFrom: string | null;
  callDuration: number | null;
  callTo: string | null;
  interlocuter: TCallParticipant | null;
}

const initialState: ICallSliceProps = {
  callStatus: "idle",
  endReason: null,
  callFrom: null,
  callTo: null,
  interlocuter: null,
  callDuration: null,
  mediaState: defaultMediaState,
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
      state.callDuration = null;
      state.mediaState = defaultMediaState;
    },

    setCallStatus(state, action: PayloadAction<TCallStatus>) {
      state.callStatus = action.payload;
    },
    setCallDuration(state, action: PayloadAction<number>) {
      state.callDuration = action.payload;
    },
    setCallTo(state, action: PayloadAction<string>) {
      state.callTo = action.payload;
      state.callStatus = "outgoing";
    },
    setCallFrom(state, action: PayloadAction<string>) {
      state.callFrom = action.payload;
    },
    setInterlocuter(state, action: PayloadAction<TCallParticipant>) {
      state.interlocuter = action.payload;
    },
    setCallEndReason(state, action: PayloadAction<TEndCallReason>) {
      state.endReason = action.payload;
    },
    setMediaState(state, action: PayloadAction<TMediaState>) {
      state.mediaState = { ...action.payload };
    },
  },
  selectors: {
    selectCallTo: (state) => state.callTo,
    selectCallEndReason: (state) => state.endReason,
    selectCallFrom: (state) => state.callFrom,
    selectCallStatus: (state) => state.callStatus,
    selectInterlocuter: (state) => state.interlocuter,
    selectMediaState: (state) => state.mediaState,
    selectCallDuration: (state) => state.callDuration,
  },
});

export const {
  setCallDuration,
  resetCallState,
  setMediaState,
  setCallFrom,
  setCallStatus,
  setCallTo,
  setInterlocuter,
  setCallEndReason,
} = callSlice.actions;
export const incrementCallDuration =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      callState: { callStatus, callDuration },
    } = getState();
    if (callStatus !== "active") return;
    if (callDuration === null) {
      dispatch(setCallDuration(0));
    } else {
      dispatch(setCallDuration(callDuration + 1));
    }
  };
export const callUserThunk =
  (user: TCallParticipant) =>
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
  selectCallDuration,
  selectCallTo,
  selectCallFrom,
  selectCallStatus,
  selectInterlocuter,
  selectCallEndReason,
  selectMediaState,
} = callSlice.selectors;
const callReducer = callSlice.reducer;
export default callReducer;
