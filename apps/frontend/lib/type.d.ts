import {
  Control,
  FieldErrors,
  FieldValues,
  FormState,
  RegisterOptions,
  UseFormGetFieldState,
  UseFormRegister,
} from "react-hook-form";
import { apiParamsType } from "../custom-hooks/useApi";

// export enum ValidationTypes {
//   name = "name",
//   id = "id",
//   text = "text",
//   onlyAlphabetsWithoutSpaces = "onlyAlphabetsWithoutSpaces",
//   textThatAllowsSpecialCharactersInBetween = "textThatAllowsSpecialCharactersInBetween",
//   number = "number",
//   email = "email",
// }

type InputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "onChange"
> &
  Partial<{
    className: string;
    inputClassName: string;
    name: string;
    placeholder: string;
    checkWhat: string;
    label: string;
    prefix: React.ReactNode;
    IsInputCorrect: boolean;
    suffix: React.ReactNode;
    isChange: (v: any) => void;
    reacthook: boolean;
    maxLength: number;
    time: number;
    apiParams: apiParamsType;
    regex: string;
    changeHandler: any;
    getFieldState: UseFormGetFieldState<FieldValues>;
    formState: FormState<FieldValues>;
  }> & {
    control: Control;
    // validationType: types;
  };

type SignUpUser = {
  fullname: string;
  username: string;
  email: string;
  password: string;
};

type UserFromBackend = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password?: string;
  refreshToken?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isGoogleAuthenticated?: boolean;
  avatar?: string;
};
