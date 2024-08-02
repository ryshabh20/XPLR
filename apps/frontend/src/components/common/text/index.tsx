import React from "react";

const sizes = {
  xs: "text-xs   lg:text-sm",
  xssemibold: "text-xs font-semibold lg:text-sm",
  sm: "text-sm lg:text-base",
  smsemibold: "text-sm font-semibold  lg:text-base",
  base: "text-base lg:text-md",
  basesemibold: "text-base font-semibold  lg:text-md",
  md: "text-md  lg:text-lg",
  mdsemibold: "text-md font-semibold  lg:text-lg",
  lg: "text-lg  lg:text-xl",
  lgsemibold: "text-lg font-semibold  lg:text-xl",
  xl: "text-xl  lg:text-2xl",
  xlsemibold: "text-xl font-semibold  lg:text-2xl",
  "2xl": "text-2xl  lg:text-3xl",
  "2xlsemibold": "text-2xl font-semibold  lg:text-3xl",
};

type TextProps = Partial<{
  className: string;
  as: React.ElementType;
  size: keyof typeof sizes;
  darkcolor: string;
}> &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >;

const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  children,
  className = "",
  as: Component = "span",
  size = "sm",
  color = "text-black",

  ...restProps
}) => {
  return (
    <Component
      className={`${className} ${sizes[size]} ${color} `}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export default Text;
