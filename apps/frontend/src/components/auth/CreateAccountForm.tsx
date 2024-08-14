import { Img } from "@/components/common/img";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import Text from "../common/text";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore, { UserSignUpState } from "@/store/authStore";
import { SignUpSchema } from "../../../utils/ZodSchemas";
import ErrorComponent from "../../../custom-ui/ErrorComponent";
import { useState } from "react";
import { useGoogleAuth } from "../../../utils/LogInWithGoogle";
export default function CreateAccountForm() {
  const { changeSignUpState, changeUserSignUpDataState } = useAuthStore(
    (state) => state
  );
  const { loginWithGoogle } = useGoogleAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [valid, setValid] = useState({
    username: false,
    email: false,
  });
  console.log("this is the valid state", valid);

  const { handleSubmit, control, formState, getFieldState } = useForm({
    mode: "onChange",
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      changeUserSignUpDataState(data as UserSignUpState);
      changeSignUpState(1);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };
  const isAnyFieldInvalid = Object.values(valid).some((el) => el === false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border p-5 space-y-5">
      <Img
        src={"/xplrlogo.svg"}
        width={150}
        height={150}
        alt="xplorelogo"
        className="mx-auto py-3"
      />
      <div className="!mt-0 flex flex-col justify-center text-center ">
        <Text size="mdsemibold" color="text-gray-500">
          Sign up to see photos and videos
        </Text>

        <Text size="mdsemibold" color="text-gray-500">
          from your friends
        </Text>
      </div>
      <Button
        type="submit"
        style="login"
        className="tracking-normal"
        onClick={loginWithGoogle}
        leftIcon={
          <Img
            src="/google-icon.svg"
            height={30}
            width={30}
            alt="google-icon"
            className="mr-1"
          />
        }
      >
        Log in with Google
      </Button>
      <div className="flex items-center ">
        <div className="w-1/2 border border-gray-300 h-0" />
        <Text size="smsemibold" color="text-gray-400" className="px-4">
          OR
        </Text>
        <div className="w-1/2 border border-gray-300 h-0" />
      </div>
      <div className="flex flex-col gap-2">
        <Input
          name="email"
          checkWhat="email"
          control={control}
          stateVal={valid}
          setterFn={setValid}
          placeholder="Email or Phone Number"
          type="email"
          formState={formState}
          time={500}
          minLength={5}
          maxLength={45}
          getFieldState={getFieldState}
        />
        <Input
          name="fullname"
          control={control}
          placeholder="Full Name"
          getFieldState={getFieldState}
          formState={formState}
        />
        <Input
          name="username"
          control={control}
          stateVal={valid}
          setterFn={setValid}
          checkWhat="username"
          time={500}
          placeholder="Username"
          getFieldState={getFieldState}
          formState={formState}
        />
        <Input
          name="password"
          control={control}
          type="password"
          placeholder="Password"
          getFieldState={getFieldState}
          formState={formState}
        />
        <Button
          type="submit"
          style="login"
          disabled={!formState.isValid || isAnyFieldInvalid}
          className={`${
            (!formState.isValid && "bg-gray-300") ||
            (isAnyFieldInvalid && "bg-gray-300")
          }`}
        >
          Sign Up
        </Button>
        <ErrorComponent message={errorMessage} />
      </div>
    </form>
  );
}
