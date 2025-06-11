import { ReactNode } from "react";

type TSubmitButtonProps = {
  children: ReactNode;
  className?: string;
};

const SubmitBtn = ({ children, className }: TSubmitButtonProps) => {
  return (
    <button
      type="submit"
      className={`p-4 rounded-md outline-none transition-all border-white border focus:border-green-400 hover:border-green-400 ${className}`}
    >
      {children}
    </button>
  );
};

export default SubmitBtn;
