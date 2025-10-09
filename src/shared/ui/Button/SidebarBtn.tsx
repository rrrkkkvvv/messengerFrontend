import { ReactNode } from "react";

type IButtonProps = {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  isSelected?: boolean;
};

const SidebarBtn = ({
  children,
  onClick,
  isSelected,
  className,
}: IButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} text-2xl h-10 w-10   flex items-center justify-center rounded-full border    transition   text-gray-50   hover:border-gray-50  ${
        isSelected && " border-gray-50"
      }`}
    >
      {children}
    </button>
  );
};

export default SidebarBtn;
