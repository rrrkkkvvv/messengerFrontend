import { TButtonProps } from "../../types/ComponentTypes";

const Button = ({ ...props }: TButtonProps) => {
  return (
    <button
      {...props}
      className={`  font-bold    outline-none transition-all    ${props.className}  `}
    ></button>
  );
};

export default Button;
