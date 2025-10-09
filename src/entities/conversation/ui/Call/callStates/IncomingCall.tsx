import Avatar from "../../../../../shared/ui/Avatar/Avatar";
import { MdCallEnd } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../../../app/store/store";
import {
  selectInterlocuter,
  setCallEndReason,
  setCallStatus,
} from "../../../model/callSlice";

const IncomingCall = () => {
  const interlocuter = useAppSelector(selectInterlocuter);

  const dispatch = useAppDispatch();
  const handleAcceptCall = () => {
    dispatch(setCallStatus("accepted"));
  };
  const handleDeclineCall = () => {
    dispatch(setCallStatus("ended"));
    dispatch(setCallEndReason("self"));
  };
  if (!interlocuter) return <></>;
  return (
    <>
      <div className="gap-5">
        <div className="flex items-center gap-5 flex-col ">
          <div className=" max-w-40 truncate text-3xl">{interlocuter.name}</div>
          <Avatar
            isMobileCallAvatar={true}
            isProfileAvatar={true}
            picture={interlocuter.avatarURL}
            hideOnline={true}
          />
        </div>
        <div className="w-full text-center mt-2 md:mt-0 uppercase text-2xl opacity-75  ">
          is calling
        </div>
      </div>

      <div className="flex  w-full justify-around">
        <div
          onClick={handleDeclineCall}
          className="bg-red-100 w-20 h-20 md:w-16 md:h-16 rounded-full cursor-pointer flex justify-center items-center"
        >
          <MdCallEnd className="text-gray-50 text-6xl animate-shake   " />
        </div>
        <div
          onClick={handleAcceptCall}
          className="animate-elevate  bg-green-200 w-20 h-20 md:w-16 md:h-16 rounded-full cursor-pointer flex justify-center items-center"
        >
          <IoIosCall className="text-gray-50 text-6xl  animate-shake  " />
        </div>
      </div>
    </>
  );
};

export default IncomingCall;
