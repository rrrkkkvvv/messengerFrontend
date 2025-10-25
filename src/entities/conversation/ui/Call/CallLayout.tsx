import { IoIosCall } from "react-icons/io";
import { IoResizeSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import IncomingCall from "./callStates/IncomingCall";
import OutgoingCall from "./callStates/OutgoingCall";
import ActiveCall from "./callStates/ActiveCall";
import useCall from "./useCall";
import { useAppSelector } from "../../../../app/store/store";
import { selectCallStatus } from "../../model/callSlice";

const CallLayout = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { localStream, remoteStream, toggleMic, toggleVideo } = useCall();

  const callStatus = useAppSelector(selectCallStatus);

  const handleToggleHidden = () => {
    setIsCollapsed((prev) => !prev);
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
  const getCallLabel = () => {
    if (callStatus === "incoming") {
      return "Incoming call";
    } else if (callStatus === "outgoing") {
      return "Outgoing call";
    } else if (callStatus === "active") {
      return "Active call";
    } else {
      return "Ended call";
    }
  };
  const styleCall = () => {
    if (isHidden) {
      return "hidden ";
    } else {
      return ` 
      text-gray-50 animate-fadeIn transition-all duration-300     md:rounded-lg  fixed z-50  bg-gray-200     ${
        isCollapsed
          ? "-translate-x-1/2 left-1/2 w-1/2 md:w-1/3 lg:w-1/5 h-16 top-0  cursor-pointer     rounded-lg"
          : "w-full h-full top-0 md:h-1/2 md:w-1/2 lg:w-1/3 md:-translate-x-1/2 md:left-1/2 md:-translate-y-1/2 md:top-1/3 "
      }`;
    }
  };
  useEffect(() => {
    if (callStatus === "idle") {
      setIsHidden(true);
    } else {
      setIsCollapsed(false);
      setIsHidden(false);
    }
  }, [callStatus]);
  return (
    <div
      onClick={() => {
        isCollapsed && handleToggleHidden();
      }}
      className={styleCall()}
    >
      <div
        className={` transition-all duration-700 flex gap-5  items-center w-full h-full justify-center  ${
          isCollapsed ? "opacity-100 visible" : "opacity-0 hidden"
        }`}
      >
        <IoResizeSharp className="text-3xl" />
        <div className="  text-xl uppercase">{getCallLabel()}</div>
        <IoIosCall className=" text-3xl  animate-shake  " />
      </div>

      <div
        className={`h-full w-full flex flex-col  overflow-hidden  items-center justify-around  ${
          isCollapsed ? "opacity-0 hidden" : "opacity-100 visible"
        }`}
      >
        <div
          onClick={handleToggleHidden}
          className="absolute left-4 top-4 cursor-pointer z-20"
        >
          <IoResizeSharp className="text-4xl" />
        </div>
        {renderCall()}
      </div>
    </div>
  );
};

export default CallLayout;
