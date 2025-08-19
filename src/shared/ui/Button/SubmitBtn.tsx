import { ReactNode } from "react";

type TSubmitButtonProps = {
  children: ReactNode;
  className?: string;
};

const SubmitBtn = ({ children, className }: TSubmitButtonProps) => {
  return (
    <button
      type="submit"
      className={`px-6 md:px-4 py-3 md:py-2 rounded-md outline-none transition-all border-white border focus:border-purple-200 hover:border-purple-50 hover:text-purple-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default SubmitBtn;
