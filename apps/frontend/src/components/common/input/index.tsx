"use client";
import React, { useState } from "react";

import { InputProps } from "../../../../lib/type";
import { Controller } from "react-hook-form";
import useDebounce from "../../../../custom-hooks/useDebounce";
import { useToast } from "../../../../custom-hooks/useToast";
import { Img } from "../img";
import axios from "axios";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      label = "",
      checkWhat = "",
      prefix,
      maxLength,
      minLength = 0,
      getFieldState,
      stateVal,
      setterFn,
      time = 0,
      formState,
      suffix,
      isChange,
      control,
      regex,
      apiParams,
      ...restProps
    },
    ref
  ) => {
    const { handleToast } = useToast();
    const [isTouched, setIsTouched] = useState(false);

    return (
      <div className={`${className} flex flex-col items-center text-black `}>
        {!!label && label}
        {!!prefix && prefix}
        <div className="relative w-full ">
          <Controller
            name={name}
            control={control}
            render={({ field: { onChange, onBlur, ref } }) => {
              const changeHandler = async (
                e: React.ChangeEvent<HTMLInputElement>
              ) => {
                if (checkWhat) {
                  try {
                    const url = `user/check?${checkWhat}=${e.target.value}`;
                    const response = await axios.get(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/${url}`
                    );
                    if (response.data.exist) {
                      setIsTouched(true);
                      if (setterFn) {
                        setterFn({
                          ...stateVal,
                          [name]: false,
                        });
                      }
                      // setValid(false);
                    } else {
                      setIsTouched(true);
                      if (setterFn) {
                        setterFn({
                          ...stateVal,
                          [name]: true,
                        });
                      }
                      // setValid(true);
                    }
                    onChange(e.target.value);
                  } catch (error) {
                    console.log(error);
                    handleToast("Error Accessing the Database", "error");
                  }
                } else {
                  onChange(e.target.value);
                }
              };

              return (
                <input
                  type={type}
                  onChange={useDebounce(changeHandler, time)}
                  onBlur={onBlur}
                  ref={ref}
                  minLength={minLength}
                  maxLength={maxLength}
                  className={`w-full px-2 ${checkWhat && "pr-8"} py-1 rounded-sm border text-sm xl:text-base h-9 ${className} ${checkWhat && "relative outline-0"}`}
                  placeholder={placeholder}
                  {...restProps}
                />
              );
            }}
          />
          {checkWhat && !stateVal[name] && isTouched && (
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
        {formState.errors &&
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
