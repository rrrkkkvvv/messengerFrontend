import { ReactNode } from "react";

type IButtonProps = {
  children: ReactNode;
  className?: string;
  onClick: () => void;
};

const SidebarBtn = ({ children, onClick }: IButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-2xl h-10 w-10   flex items-center justify-center rounded-full border    transition   text-gray-300  hover:border-gray-50"
    >
      {children}
    </button>
  );
};

export default SidebarBtn;
