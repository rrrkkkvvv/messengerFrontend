type InputPropsType = {
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  className?: string;
};
const Input = ({
  placeholder,
  type,
  value,
  onChange,
  onClick,
  className,
}: InputPropsType) => {
  return (
    <input
      onChange={onChange}
      onClick={onClick}
      type={type}
      placeholder={placeholder}
      value={value}
      className={`
        bg-green-400
        p-4 rounded-md
        placeholder:text-white 
        outline-none
        
        transition-all
        focus:border-white
        focus:border-4
        hover:border-white
        hover:border-2 
        ${className}
        `}
    />
  );
};

export default Input;
