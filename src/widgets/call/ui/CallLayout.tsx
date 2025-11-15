import { IoResizeSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import IncomingCall from "./callStates/IncomingCall";
import OutgoingCall from "./callStates/OutgoingCall";
import ActiveCall from "./callStates/ActiveCall";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { selectCallStatus } from "../../../entities/call/";
import { useCall } from "../../../entities/call";
import {
  selectIsCallCollapsed,
  toggleIsCallCollapsed,
} from "../../../features/call";

const CallLayout = () => {
  const [isHidden, setIsHidden] = useState(false);
  const { localStream, remoteStream, toggleMic, toggleVideo } = useCall();
  const dispatch = useAppDispatch();
  const callStatus = useAppSelector(selectCallStatus);
  const isCollapsed = useAppSelector(selectIsCallCollapsed);
  const handleToggleCollapsed = () => {
    dispatch(toggleIsCallCollapsed());
  };
  const renderCall = () => {
    if (callStatus === "incoming") {
      return <IncomingCall />;
    } else if (callStatus === "outgoing") {
      return <OutgoingCall />;
    } else if (callStatus === "active") {
      return (
        <ActiveCall
          toggleVideo={toggleVideo}
          toggleMic={toggleMic}
          localStream={localStream}
          remoteStream={remoteStream}
        />
      );
    } else if (callStatus === "idle") {
      return <></>;
    }
  };

  useEffect(() => {
    if (callStatus === "idle") {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  }, [callStatus]);
  return (
    <div
      onClick={() => {
        isCollapsed && handleToggleCollapsed();
      }}
      className={` 
         ${isHidden && "hidden"}
      text-gray-50  transition-all duration-300 overflow-hidden     md:rounded-lg  fixed z-50  bg-gray-200 h-full  w-full  top-0 md:h-1/2 md:w-1/2 lg:w-1/3  md:left-1/2 md:-translate-x-1/2  ${
        isCollapsed
          ? " opacity-0 scale-0  -translate-y-1/2 top-0"
          : "opacity-100 scale-100 translate-0     md:-translate-y-1/2 md:top-1/3"
      }`}
    >
      <div
        className={`h-full w-full flex flex-col relative  overflow-hidden  items-center justify-around `}
      >
        <div
          onClick={handleToggleCollapsed}
          className="absolute left-4 top-4 cursor-pointer z-10"
        >
          <IoResizeSharp className="text-4xl" />
        </div>
        {renderCall()}
      </div>
    </div>
  );
};

export default CallLayout;
