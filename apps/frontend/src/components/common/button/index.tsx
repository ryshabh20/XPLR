const buttons = {
  login:
    "bg-blue-400 text-white w-full rounded-md p-1 mt-2 font-medium tracking-wider xl:py-[6px] ",
};
type ButtonProps = Omit<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  "onClick"
> &
  Partial<{
    className: string;
    leftIcon: React.ReactNode;
    disabled: boolean;
    rightIcon: React.ReactNode;
    onClick: () => void;
    style: keyof typeof buttons;
  }>;
const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  className = "",
  children,
  leftIcon,
  disabled,
  onClick,
  rightIcon,
  color = "bg-blue-400",
  style = "login",
  ...restProps
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className} flex items-center justify-center text-center cursor-pointer
         ${buttons[style as keyof typeof buttons]}
       ${color} ${
        disabled && "disabled:opacity-75 disabled:hover:cursor-not-allowed"
      }`}
      disabled={disabled}
      {...restProps}
    >
      {!!leftIcon && leftIcon} {children} {!!rightIcon && rightIcon}
    </button>
  );
};

export default Button;
