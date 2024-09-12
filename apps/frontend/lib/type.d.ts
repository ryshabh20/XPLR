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
    prefixIcon: React.ReactNode;
    IsInputCorrect: boolean;
    suffix: React.ReactNode;
    innerDivClassName: string;
    isChange: (v: any) => void;
    reacthook: boolean;
    maxLength: number;
    time: number;
    apiParams: apiParamsType;
    regex: string;
    changeHandler: any;
    getFieldState: UseFormGetFieldState<FieldValues>;
    formState: FormState<FieldValues>;
    inputContent: React.ReactNode;
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

type Participant = {
  joinedAt: Date;
  conversationId: string;
  userId: string;
  isReadByParticipant: boolean;
};

type Conversation = {
  id: string;
  creatorId: string;
  isGroup: boolean;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
};

type Messages = {
  id: string;
  senderId: string;
  content?: string;
  mediaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  latestMessageId?: string;
};
