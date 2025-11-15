import { IoIosCall } from "react-icons/io";

import { MdCallEnd } from "react-icons/md";
import BorderedButton from "../../../shared/ui/Button/BorderedButton";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import {
  selectCallStatus,
  selectInterlocuter,
  setCallEndReason,
  setCallStatus,
} from "../../../entities/call";

import { selectCallDuration } from "../../../entities/call/model/callSlice";
import { formatTime } from "../../../shared/utils/formatTime";
import Avatar from "../../../shared/ui/Avatar/Avatar";
import {
  selectIsCallCollapsed,
  setIsCallCollapsed,
} from "../../../features/call";

const CollapsedCall = () => {
  const dispatch = useAppDispatch();
  const callStatus = useAppSelector(selectCallStatus);
  const callDuration = useAppSelector(selectCallDuration);

  const interlocuter = useAppSelector(selectInterlocuter);
  const handleStopCall = () => {
    dispatch(setCallStatus("ended"));
    dispatch(setCallEndReason("self"));
  };
  const handleAcceptCall = () => {
    dispatch(setCallStatus("accepted"));
  };
  const isCollapsed = useAppSelector(selectIsCallCollapsed);
  const handleExpandCall = () => {
    if (isCollapsed) {
      dispatch(setIsCallCollapsed(false));
    }
  };
  if (!interlocuter) return <></>;

  return (
    <div
      className="h-14 bg-gray-200 text-gray-50 flex justify-around items-center cursor-pointer  "
      onClick={handleExpandCall}
    >
      {/* <div className="  rounded-full transition-all cursor-pointer border hover:border-gray-50 p-1 flex justify-center items-center"></div> */}

      <div className="font-semibold flex items-center gap-2 ">
        <Avatar
          avatarType="collapsedCall"
          picture={interlocuter.avatarURL}
          hideOnline={true}
        />
        <div className="flex items-end  ">
          {callStatus === "incoming" ? (
            <>
              <div className="truncate max-w-24">{interlocuter.name}</div>
              <div className="ml-1">is calling</div>
            </>
          ) : callStatus === "outgoing" ? (
            <>
              <div>Calling to </div>
              <div className="truncate max-w-24 ml-1">{interlocuter.name}</div>
            </>
          ) : (
            <>
              <div className="truncate max-w-24">{interlocuter.name}</div>
              {callDuration !== null && (
                <div className="ml-1">{formatTime(callDuration)}</div>
              )}
            </>
          )}
          {(callStatus === "incoming" || callStatus === "outgoing") && (
            <div className="flex pb-1 gap-0.5">
              <div className="h-1 w-1 bg-gray-50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-1 w-1 bg-gray-50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-1 w-1 bg-gray-50 rounded-full animate-bounce"></div>
            </div>
          )}
        </div>
      </div>
      <div>
        {callStatus === "incoming" && (
          <BorderedButton onClick={handleAcceptCall}>
            <IoIosCall className="text-green-200 animate-shake   text-3xl    " />
          </BorderedButton>
        )}
        <BorderedButton onClick={handleStopCall}>
          <MdCallEnd className="text-red-100   text-3xl    " />

          {/* <CiMicrophoneOn className="text-gray-50   text-3xl    " /> */}
          {/* <CiMicrophoneOff className="text-gray-50   text-3xl    " /> */}
        </BorderedButton>
      </div>
    </div>
  );
};

export default CollapsedCall;
