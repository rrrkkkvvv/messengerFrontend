import { InputHTMLAttributes } from "react";

type TInputProps = InputHTMLAttributes<HTMLInputElement>;
const Input = ({ ...props }: TInputProps) => {
  return (
    <input
      {...props}
      className={`
                      ${props.className}

        p-3 rounded-md
        placeholder:text-gray-100 
        outline-none
          
        transition-all
bg-gray-300         focus:outline-gray-100
        focus:outline-4
    
        `}
    />
  );
};

export default Input;
