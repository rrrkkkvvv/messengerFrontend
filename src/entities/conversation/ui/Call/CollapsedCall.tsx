import { IoIosCall } from "react-icons/io";
import BorderedButton from "../../../../shared/ui/Button/BorderedButton";

import { MdCallEnd } from "react-icons/md";

const CollapsedCall = () => {
  return (
    <div className="h-14 bg-gray-300 text-gray-50 flex justify-around items-center cursor-pointer  ">
      <BorderedButton>
        <MdCallEnd className="text-red-100   text-3xl    " />

        {/* <CiMicrophoneOn className="text-gray-50   text-3xl    " /> */}
        {/* <CiMicrophoneOff className="text-gray-50   text-3xl    " /> */}
      </BorderedButton>
      {/* <div className="  rounded-full transition-all cursor-pointer border hover:border-gray-50 p-1 flex justify-center items-center"></div> */}

      <div className="font-semibold flex items-center gap-2 text-xl">
        <div className="text-2xl">
          {/* <SlCallOut /> */}

          {/* <LuPhoneCall /> */}
        </div>

        <div className="flex items-end">
          Someone is calling
          <div className="flex pb-1 gap-0.5">
            <div className="h-1 w-1 bg-gray-50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-1 w-1 bg-gray-50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-1 w-1 bg-gray-50 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
      <BorderedButton>
        <IoIosCall className="text-green-200 animate-shake   text-3xl    " />
      </BorderedButton>
    </div>
  );
};

export default CollapsedCall;
