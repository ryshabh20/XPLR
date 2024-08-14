import { FieldValues, useForm } from "react-hook-form";
import { Img } from "../common/img";
import Input from "../common/input";
import Text from "../common/text";
import { OtpSchema } from "../../../utils/ZodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../common/button";
import useAuthStore from "@/store/authStore";
import useApi from "../../../custom-hooks/useApi";
import ErrorComponent from "../../../custom-ui/ErrorComponent";
import { useState } from "react";
import ResendOtp from "./ui/ResendOtp";

const MailVerification = () => {
  const { control, handleSubmit, formState, getFieldState } = useForm({
    mode: "onChange",
    resolver: zodResolver(OtpSchema),
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { changeSignUpState, userSignUpDataState } = useAuthStore(
    (state) => state
  );

  const verifyOtp = useApi({
    method: "POST",
    queryKey: ["verify-otp"],
    url: "/user/verify-otp",
  })?.post;
  const onSubmit = async (data: FieldValues) => {
    try {
      const isVerified = await verifyOtp?.mutateAsync({
        otp: data,
        data: userSignUpDataState,
      });
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };
  return (
    <form
      className="border p-4 space-y-5 text-center "
      onSubmit={handleSubmit(onSubmit)}
    >
      <Img
        src="/mailverfication.svg"
        height={90}
        width={90}
        alt="mail"
        className="mx-auto"
      />
      <Text size="smsemibold">Enter confirmation code</Text>
      <Text className="block" size="xs">
        Enter the confirmation code that we have sent to{" "}
        {userSignUpDataState.email}.<ResendOtp />
      </Text>
      <Input
        maxLength={6}
        placeholder="Confirmation Code"
        name="otp"
        control={control}
        formState={formState}
        getFieldState={getFieldState}
        className="!rounded-md"
      />

      <Button
        disabled={!!formState.errors.otp?.message}
        type="submit"
        style="login"
        className={`mx-auto !mb-3 ${!!formState.errors.otp?.message && "bg-gray-300"}`}
      >
        Next
      </Button>
      <Text
        size="smsemibold"
        color="text-blue-400"
        className="hover:cursor-pointer"
        onClick={() => changeSignUpState(0)}
      >
        {" "}
        Go Back
      </Text>
      <ErrorComponent
        message={errorMessage}
        className="mt-1"
        size="xssemibold"
        color="text-red-400"
      />
    </form>
  );
};

export default MailVerification;
