import { useAppDispatch, useAppSelector } from "../../../../../app/store/store";
import Avatar from "../../../../../shared/ui/Avatar/Avatar";
import { MdCallEnd } from "react-icons/md";
import {
  selectInterlocuter,
  setCallEndReason,
  setCallStatus,
} from "../../../model/callSlice";

const OutgoingCall = () => {
  const interlocuter = useAppSelector(selectInterlocuter);

  const dispatch = useAppDispatch();
  const handleStopCall = () => {
    dispatch(setCallStatus("ended"));
    dispatch(setCallEndReason("self"));
  };
  if (!interlocuter) return <></>;
  return (
    <>
      <div className="gap-5">
        <div className="flex items-center gap-5 flex-col ">
          <div className="  text-3xl">{interlocuter.name}</div>
          <Avatar
            isMobileCallAvatar={true}
            isProfileAvatar={true}
            picture={interlocuter.avatarURL}
            hideOnline={true}
          />
        </div>
        <div className="w-full text-center mt-2 md:mt-0 uppercase text-2xl opacity-75  ">
          outgoing call
        </div>
      </div>

      <div className="flex  w-full justify-around">
        <div
          onClick={handleStopCall}
          className="bg-red-100 w-20 h-20 md:w-16 md:h-16 rounded-full cursor-pointer flex justify-center items-center"
        >
          <MdCallEnd className="text-white text-6xl animate-shake   " />
        </div>
      </div>
    </>
  );
};

export default OutgoingCall;
