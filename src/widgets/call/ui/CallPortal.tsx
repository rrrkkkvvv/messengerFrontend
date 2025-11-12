import { createPortal } from "react-dom";
import CallLayout from "./CallLayout";

const Call = () => {
  return createPortal(
    <CallLayout />,
    document.querySelector("#callPortal") as HTMLElement
  );
};

export default Call;
