import { Img } from "@/components/common/img";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import Text from "../common/text";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/store/authStore";
import { SignUpSchema } from "../../../utils/ZodSchemas";
import { useToast } from "../../../custom-hooks/useToast";
import useApi from "../../../custom-hooks/useApi";
import ErrorComponent from "../../../custom-ui/ErrorComponent";
import { useState } from "react";
export default function CreateAccountForm() {
  const signUpUser = useApi({
    method: "POST",
    queryKey: ["registerUser"],
    url: "/user/signup",
  })?.post;
  const { changeSignUpState, changeUserSignUpDataState } = useAuthStore(
    (state) => state
  );
  const [errorMessage, setErrorMessage] = useState("");
  const { handleToast } = useToast();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      console.log(data);
      changeUserSignUpDataState(data);
      changeSignUpState(1);
      // const result = await signUpUser?.mutateAsync(data);
      // if (result) {
      //   changeSignUpState(1);
      // }
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.response.data.message);
      // handleToast(error.message, "error");
    }
  };
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
          control={control}
          placeholder="Email or Phone Number"
          type="email"
          errors={errors}
          minLength={5}
          maxLength={45}
          validationSchema={{
            required: "Email or Phone Number is required",
          }}
        />
        <Input
          name="fullname"
          control={control}
          placeholder="Full Name"
          errors={errors}
          validationSchema={{
            required: "Full Name is required",
          }}
        />
        <Input
          name="username"
          control={control}
          placeholder="Username"
          errors={errors}
          validationSchema={{
            required: "Password is required",
          }}
        />
        <Input
          name="password"
          control={control}
          type="password"
          placeholder="Password"
          errors={errors}
          validationSchema={{
            required: "Password is required",
          }}
        />
        <Button type="submit" style="login">
          Sign Up
        </Button>
        <ErrorComponent message={errorMessage} />
      </div>
    </form>
  );
}
