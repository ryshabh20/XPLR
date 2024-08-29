import React from "react";

export const sizes = {
  mini: "text-mini",
  minisemibold: "text-mini font-semibold",
  xs: "text-xs",
  xssemibold: "text-xs font-semibold",
  sm: "text-sm",
  smsemibold: "text-sm font-semibold",
  base: "text-base",
  basesemibold: "text-base font-semibold",
  md: "text-md",
  mdsemibold: "text-md font-semibold",
  lg: "text-lg",
  lgsemibold: "text-lg font-semibold",
  xl: "text-xl",
  xlsemibold: "text-xl font-semibold",
  "2xl": "text-2xl",
  "2xlsemibold": "text-2xl font-semibold",
  // mini: "text-mini   sm:text-xs",
  // minisemibold: "text-mini font-semibold sm:text-xs",
  // xs: "text-xs   sm:text-sm",
  // xssemibold: "text-xs font-semibold sm:text-sm",
  // sm: "text-sm sm:text-base",
  // smsemibold: "text-sm font-semibold  sm:text-base",
  // base: "text-base sm:text-md",
  // basesemibold: "text-base font-semibold  sm:text-md",
  // md: "text-md  sm:text-lg",
  // mdsemibold: "text-md font-semibold  sm:text-lg",
  // lg: "text-lg  sm:text-xl",
  // lgsemibold: "text-lg font-semibold  sm:text-xl",
  // xl: "text-xl  lg:text-2xl",
  // xlsemibold: "text-xl font-semibold  sm:text-2xl",
  // "2xl": "text-2xl  sm:text-3xl",
  // "2xlsemibold": "text-2xl font-semibold  sm:text-3xl",
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
