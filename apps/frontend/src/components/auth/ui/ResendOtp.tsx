import React, { useEffect, useState } from "react";
import Text from "../../common/text";
import useApi from "../../../../custom-hooks/useApi";
import { useToast } from "../../../../custom-hooks/useToast";
import useAuthStore from "@/store/authStore";

const ResendOtp = () => {
  const [counter, setCounter] = useState(90);
  const { handleToast } = useToast();
  const { email } = useAuthStore((state) => state.userSignUpDataState);
  const sendOtp = useApi({
    method: "POST",
    queryKey: ["sendOtp"],
    url: "/auth/otp",
  })?.post;
  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter(counter - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [counter]);
  return (
    <Text
      size="smsemibold"
      color={counter <= 0 ? "text-blue-500" : "text-gray-500"}
      className={`hover:cursor-default ${counter <= 0 && "hover:cursor-pointer"}`}
      onClick={async () => {
        if (counter > 0) {
          try {
            await sendOtp?.mutateAsync({ email });
            setCounter(90);
          } catch (error: any) {
            handleToast(error.message, "error");
          }
        }
      }}
    >
      {" "}
      Resend Code{" "}
    </Text>
  );
};

export default ResendOtp;
