import { FormEvent, MouseEvent } from "react";

type InputPropsType = {
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: FormEvent<HTMLInputElement>) => void;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
};
const Input = ({
  placeholder,
  type,
  value,
  onChange,
  onClick,
  className,
  required,
  disabled,
}: InputPropsType) => {
  return (
    <input
      disabled={!!disabled}
      required={required}
      onChange={onChange}
      onClick={onClick}
      type={type}
      placeholder={placeholder}
      value={value}
      className={`
        
        p-3 rounded-2xl
        placeholder:text-white 
        outline-none
        
        transition-all

        ${
          disabled
            ? "bg-gray-200"
            : `bg-purple-200         focus:border-white
        focus:border 
        hover:border-white
        hover:border   `
        }
        ${className}
        `}
    />
  );
};

export default Input;
