import { FC } from "react";
import Button from "./Button";
import { TButtonProps } from "../../types/ComponentTypes";

const SolidButton: FC<TButtonProps> = ({ ...props }) => {
  return (
    <Button
      {...props}
      className={`px-6 md:px-4 py-3 md:py-2 rounded-md bg-gray-50 text-gray-400   text-center flex items-center justify-center   transition-all    focus:opacity-70    hover:opacity-75 ${props.className}`}
    ></Button>
  );
};

export default SolidButton;
