"use client";
import { Img } from "@/components/common/img";
import Input from "@/components/common/input";
import Text from "@/components/common/text";
import { FieldValues, useForm } from "react-hook-form";
import Link from "next/link";
import Button from "@/components/common/button";
import useApi from "../../../../custom-hooks/useApi";
import { useGoogleAuth } from "../../../../utils/LogInWithGoogle";
import { useRouter } from "next/navigation";
import ErrorComponent from "../../../../custom-ui/ErrorComponent";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const { handleSubmit, control, formState, getFieldState } = useForm();
  const login = useApi({
    method: "POST",
    queryKey: ["login-with-user"],
    url: "/auth/login",
  })?.post;
  const { loginWithGoogle } = useGoogleAuth();

  const onSubmit = async (data: FieldValues) => {
    try {
      await login?.mutateAsync({ data });
      router.push("/");
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
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
          <ErrorComponent
            message={errorMessage}
            className="mt-1"
            size="xssemibold"
            color="text-red-400"
          />
          <Button type="submit" style="login">
            Login
          </Button>
        </div>
        <div className="flex items-center ">
          <div className="w-1/2 border border-gray-300 h-0" />
          <Text size="basesemibold" color="text-gray-400" className="px-4">
            OR
          </Text>
          <div className="w-1/2 border border-gray-300 h-0" />
        </div>
        <div className="flex flex-col gap-3 justify-center items-center">
          <div
            className="flex gap-1 items-center hover:cursor-pointer shadow-lg  p-2.5 rounded-md"
            onClick={loginWithGoogle}
          >
            <Img
              src="/google-icon.svg"
              height={25}
              width={25}
              alt="google icon"
            />
            <Text size="basesemibold" color="text-blue-500">
              Log in with Google
            </Text>
          </div>
          <Text size="base" color="text-blue-900 ml-3">
            Forgotten your password?
          </Text>
        </div>
      </form>
      <div className="border p-5  flex justify-center gap-2">
        <Text size="base">Don't have an account?</Text>
        <Text size="basesemibold" color="text-blue-400 hover:cursor-pointer">
          <Link href={"/register"}>Sign Up</Link>
        </Text>
      </div>
    </div>
  );
}
