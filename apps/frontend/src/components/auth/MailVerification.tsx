import { FieldValues, useForm } from "react-hook-form";
import { Img } from "../common/img";
import Input from "../common/input";
import Text from "../common/text";
import { OtpSchema } from "../../../utils/ZodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../common/button";
import useAuthStore from "@/store/authStore";
import useApi from "../../../custom-hooks/useApi";
import { verify } from "crypto";
import ErrorComponent from "../../../custom-ui/ErrorComponent";
import { useState } from "react";

const MailVerification = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
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
  const onSubmit = (data: FieldValues) => {
    try {
      const isVerified = verifyOtp?.mutateAsync({
        otp: data,
        data: userSignUpDataState,
      });
    } catch (error) {}
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
      <Text>Enter confirmation code</Text>
      <Text size="smsemibold" className="block">
        Enter the confirmation code that we have sent to{" "}
      </Text>
      <Input
        placeholder="Confirmation Code"
        name="otp"
        control={control}
        errors={errors}
        className="!rounded-md"
      />
      <ErrorComponent message={errorMessage} />
      <Button
        disabled={false}
        type="submit"
        style="login"
        className="mx-auto !mb-3 "
      >
        Next
      </Button>
      <Text
        size="smsemibold"
        color="text-blue-400"
        className="hover:cursor-pointer"
        onClick={() => changeSignUpState(1)}
      >
        {" "}
        Go Back
      </Text>
    </form>
  );
};

export default MailVerification;
