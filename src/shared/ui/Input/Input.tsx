import { FormEvent, MouseEvent } from "react";

type InputPropsType = {
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: FormEvent<HTMLInputElement>) => void;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void;
  className?: string;
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
}: InputPropsType) => {
  return (
    <input
      required={required}
      onChange={onChange}
      onClick={onClick}
      type={type}
      placeholder={placeholder}
      value={value}
      className={`
        bg-green-400
        p-3 rounded-2xl
        placeholder:text-white 
        outline-none
        
        transition-all
        focus:border-white
        focus:border 
        hover:border-white
        hover:border  
        ${className}
        `}
    />
  );
};

export default Input;
