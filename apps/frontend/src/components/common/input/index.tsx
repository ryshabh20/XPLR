"use client";
import React, { useState } from "react";

import { InputProps } from "../../../../lib/type";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import useDebounce from "../../../../custom-hooks/useDebounce";
import { Img } from "../img";
import { useDebounceCallback } from "usehooks-ts";
import { axiosInstance } from "../../../../custom-hooks/useApi";
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      inputContent,
      type = "text",
      label = "",
      checkWhat = "",
      prefixIcon,
      maxLength,
      minLength = 0,
      getFieldState,
      inputClassName,
      time = 0,
      IsInputCorrect,
      innerDivClassName,
      formState,
      suffix,
      isChange,
      control,
      regex,
      apiParams,
      changeHandler = (field: ControllerRenderProps<FieldValues>) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
          field.onChange(e.target.value);
        },
      ...restProps
    },
    ref
  ) => {
    const [isTouched, setIsTouched] = useState(false);
    const debounced = useDebounce(async (e, field) => {
      changeHandler(field, checkWhat, setIsTouched)(e);
    }, time);
    return (
      <div className={`${className} flex items-center flex-col text-black `}>
        {!!label && label}
        {!!prefixIcon && prefixIcon}
        <div className={`relative w-full ${innerDivClassName}`}>
          {inputContent && inputContent}
          <Controller
            name={name}
            control={control}
            render={({ field }) => {
              return (
                <input
                  key={name}
                  name={name}
                  type={type}
                  onChange={(e) => {
                    field.onChange(e.target.value);

                    debounced(e, field);
                  }}
                  onBlur={field.onBlur}
                  ref={ref}
                  value={field.value}
                  minLength={minLength}
                  maxLength={maxLength}
                  className={`w-full px-2 ${checkWhat && "pr-8"} py-1 rounded-sm border text-sm xl:text-base h-9 ${inputClassName} ${checkWhat && "relative outline-0"}`}
                  placeholder={placeholder}
                  {...restProps}
                />
              );
            }}
          />

          {checkWhat && !IsInputCorrect && isTouched && (
            <Img
              src="/check-cross.svg"
              height={20}
              width={20}
              alt="cross"
              className="absolute top-[50%] translate-y-[-50%] right-2"
            />
          )}
        </div>
        {!!suffix && suffix}
        {formState &&
          formState.errors &&
          typeof formState.errors[name]?.message === "string" && (
            <span className="text-red-500 self-start text-sm xl:text-[15px] p-1">
              {formState.errors[name]?.message}
            </span>
          )}
      </div>
    );
  }
);

export default Input;
