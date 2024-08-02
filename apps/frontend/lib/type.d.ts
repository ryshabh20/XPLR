import {
  Control,
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

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
    name: string;
    placeholder: string;
    label: string;
    prefix: React.ReactNode;
    suffix: React.ReactNode;
    isChange: (v: any) => void;
    reacthook: boolean;
    maxLength: number;
    validationSchema: RegisterOptions<TFieldValues, TFieldName>;

    errors: FieldErrors<FieldValues>;
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
