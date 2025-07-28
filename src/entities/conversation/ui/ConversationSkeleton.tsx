import { FaArrowAltCircleDown } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import Input from "../../../shared/ui/Input/Input";

const ConversationSkeleton = () => {
  return (
    <>
      <div className="flex flex-col w-dvw h-dvh overflow-hidden md:w-3/5  relative text-white ">
        {/* HEADER */}
        <h1 className="flex px-5  border border-gray-200  w-full z-10  items-center justify-between h-20 bg-gray-200">
          {/* {isMobile && (
            <button
              type="button"
              className="text-green-400 mx-2 p-2 text-2xl rounded-full outline-none  transition-all focus:outline-green-400 hover:outline-green-200"
              onClick={handleCloseConversation}
            >
              <FaArrowLeft />
            </button>
          )} */}
          <div className="flex flex-row scale-125 md:scale-100 items-center gap-5">
            <div className="h-11 w-11 rounded-full bg-gray-300 relative animate-pulse"></div>

            <div className="flex flex-col ">
              <div className="text-lg  truncate h-6  w-56 rounded-lg bg-gray-200"></div>
            </div>
          </div>
          <div className="">
            <div className="text-gray-300 mx-2 p-2 rounded-full outline-none  text-3xl animate-pulse       ">
              <HiDotsHorizontal />
            </div>
            {/* {!isMobile && (
              <button
                type="button"
                onClick={closeConversation}
                className="text-green-400 mx-2 p-2 rounded-full outline-none  text-3xl  transition-all   hover:outline-green-200"
              >
                <IoCloseOutline />
              </button>
            )} */}
          </div>
        </h1>

        {/* MESSAGES */}
        <div
          className={`scroll-smooth  bg-gray-300 text-2xl h-dvh relative text-center border-2 border-gray-200   `}
        >
          <div className="relative"></div>
          <div
            className={`text-gray-300 transition bottom-24 duration-300 flex fixed text-5xl right-0 px-4 justify-center z-20 `}
          >
            <FaArrowAltCircleDown className=" bg-gray-200 box-content rounded-full animate-pulse" />
          </div>
        </div>
        {/* INPUT MESSAGE */}
        <form
          className={`flex flex-col relative  px-5 justify-center bottom-0 w-full z-30 gap-3 py-4 bg-gray-300 border-l-2 border-gray-200 `}
        >
          <div className="flex gap-5 items-center">
            <Input
              disabled={true}
              type="text"
              className="w-full  animate-pulse   bg-gray-200"
            />
            {/* <IoMdImages className="text-5xl transition duration-300 text-gray-100  " /> */}
            <div className="h-10 w-12 bg-gray-200 animate-pulse rounded-md"></div>
            {/* <UploadButton /> */}
            <div className="h-12 w-16 bg-gray-200 animate-pulse rounded-md"></div>

            {/* <SubmitBtn children={"Send"} className="animate-pulse" /> */}
          </div>
        </form>
        {/* <div>
          <input
            className={`
        bg-gray-200
        p-3 rounded-2xl
         outline-none
        animate-pulse
           `}
          />

          <IoMdImages className="text-4xl transition duration-300 animate-pulse " />

          <button
            className={`p-4 rounded-md outline-none transition-all animate-pulse border-white border h-7 w-7 `}
          >
            sdsd
          </button>
        </div> */}
      </div>
    </>
  );
};

export default ConversationSkeleton;
