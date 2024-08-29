"use client";

import CreateAccountForm from "@/components/auth/CreateAccountForm";
import DobForm from "@/components/auth/DobForm";
import MailVerification from "@/components/auth/MailVerification";
import Text from "@/components/common/text";
import useAuthStore from "@/store/authStore";
import Link from "next/link";

export default function Register() {
  const signUpState = useAuthStore((state) => state.signUpState);

  return (
    <div className="flex flex-col gap-3 shadow-xl  w-80 xl:w-96">
      {signUpState === 0 && <CreateAccountForm />}
      {signUpState === 1 && <DobForm />}
      {signUpState === 2 && <MailVerification />}
      <div className="border p-5  flex justify-center gap-2">
        <Text size="base">Have an account?</Text>
        <Text size="basesemibold" color="text-blue-400 hover:cursor-pointer">
          <Link href={"/login"}>Log In</Link>
        </Text>
      </div>
    </div>
  );
}
