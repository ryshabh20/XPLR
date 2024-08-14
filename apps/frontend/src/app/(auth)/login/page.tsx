"use client";
import { Img } from "@/components/common/img";
import Input from "@/components/common/input";
import Text from "@/components/common/text";
import { FieldValues, useForm } from "react-hook-form";
import Link from "next/link";
import Button from "@/components/common/button";
import useApi from "../../../../custom-hooks/useApi";
import { useGoogleAuth } from "../../../../utils/LogInWithGoogle";

export default function Login() {
  const { handleSubmit, control, formState, getFieldState } = useForm();
  const login = useApi({
    method: "POST",
    queryKey: ["login-with-user"],
    url: "/user/login",
    config: {
      withCredentials: true,
    },
  })?.post;
  const { loginWithGoogle } = useGoogleAuth();

  const onSubmit = async (data: FieldValues) => {
    try {
      const response = await login?.mutateAsync({ data });
    } catch (error) {}
  };
  return (
    <div className="flex flex-col gap-3 shadow-xl w-full xl:w-96">
      <form onSubmit={handleSubmit(onSubmit)} className="border p-5 space-y-5">
        <Img
          src={"/xplrlogo.svg"}
          width={150}
          height={150}
          alt="xplorelogo"
          className="mx-auto py-3"
        />

        <div className="flex flex-col gap-2">
          <Input
            name="email"
            control={control}
            getFieldState={getFieldState}
            placeholder="Email or Username"
            formState={formState}
          />
          <Input
            name="password"
            control={control}
            type="password"
            getFieldState={getFieldState}
            placeholder="Password"
            formState={formState}
          />
          <Button type="submit" style="login">
            Login
          </Button>
        </div>
        <div className="flex items-center ">
          <div className="w-1/2 border border-gray-300 h-0" />
          <Text size="smsemibold" color="text-gray-400" className="px-4">
            OR
          </Text>
          <div className="w-1/2 border border-gray-300 h-0" />
        </div>
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="flex gap-1 items-center" onClick={loginWithGoogle}>
            <Img
              src="/google-icon.svg"
              height={25}
              width={25}
              alt="google icon"
            />
            <Text size="smsemibold" color="text-blue-500">
              Log in with Google
            </Text>
          </div>
          <Text size="xs" color="text-blue-900 ml-3">
            Forgotten your password?
          </Text>
        </div>
      </form>
      <div className="border p-5  flex justify-center gap-2">
        <Text size="sm">Don't have an account?</Text>
        <Text size="smsemibold" color="text-blue-400 hover:cursor-pointer">
          <Link href={"/register"}>Sign Up</Link>
        </Text>
      </div>
    </div>
  );
}
