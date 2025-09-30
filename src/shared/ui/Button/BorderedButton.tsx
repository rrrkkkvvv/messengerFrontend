import { FC } from "react";
import Button from "./Button";
import { TButtonProps } from "../../types/ComponentTypes";

const BorderedButton: FC<TButtonProps> = ({ ...props }) => {
  return (
    <Button
      {...props}
      className={`text-gray-50 mx-2 p-2   text-2xl rounded-full outline-none   transition-all focus:outline-gray-300 hover:outline-gray-50 overflow-hidden ${props.className}`}
    ></Button>
  );
};

export default BorderedButton;
