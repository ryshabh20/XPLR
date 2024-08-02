"use client";
import React from "react";

import { InputProps } from "../../../../lib/type";
import { Controller } from "react-hook-form";
import useDebounce from "../../../../custom-hooks/useDebounce";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      label = "",
      prefix,
      maxLength,
      minLength = 0,
      errors,
      suffix,
      isChange,
      control,
      validationSchema,
      ...restProps
    },
    ref
  ) => {
    return (
      <div className={`${className} flex flex-col items-center text-black `}>
        {!!label && label}
        {!!prefix && prefix}

        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, onBlur, ref } }) => {
            return (
              <input
                type={type}
                onChange={useDebounce(onChange, 500)}
                onBlur={onBlur}
                ref={ref}
                className={`w-full px-2 py-1 rounded-sm border text-sm xl:text-base h-9 ${className}`}
                placeholder={placeholder}
                {...restProps}
              />
            );
          }}
        />
        {!!suffix && suffix}
        {errors && typeof errors[name]?.message === "string" && (
          <span className="text-red-500 self-start text-sm xl:text-[15px] p-1">
            {errors[name]?.message}
          </span>
        )}
      </div>
    );
  }
);

export default Input;
