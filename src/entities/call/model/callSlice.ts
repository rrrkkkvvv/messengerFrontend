import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TCallParticipant,
  TCallStatus,
  TEndCallReason,
  TMediaState,
} from "../api/callTypes";
import { AppDispatch, RootState } from "../../../app/store/store";
import { defaultMediaState } from "../../../shared/values/mediaStateConfig";

interface ICallSliceProps {
  mediaState: TMediaState;
  callStatus: TCallStatus;
  endReason: TEndCallReason;
  callFrom: string | null;
  callTo: string | null;
  interlocuter: TCallParticipant | null;
}

const initialState: ICallSliceProps = {
  callStatus: "idle",
  endReason: null,
  callFrom: null,
  callTo: null,
  interlocuter: null,
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
      state.mediaState = defaultMediaState;
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
  },
});

export const {
  resetCallState,
  setMediaState,
  setCallFrom,
  setCallStatus,
  setCallTo,
  setInterlocuter,
  setCallEndReason,
} = callSlice.actions;
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
  selectCallTo,
  selectCallFrom,
  selectCallStatus,
  selectInterlocuter,
  selectCallEndReason,
  selectMediaState,
} = callSlice.selectors;
const callReducer = callSlice.reducer;
export default callReducer;
