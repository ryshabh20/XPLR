import useAuthStore from "@/store/authStore";
import DatePicker from "../../../custom-ui/auth/DatePicker";
import Button from "../common/button";
import { Img } from "../common/img";
import Text from "../common/text";
import { useState } from "react";
import PermissionDenied from "../../../custom-ui/auth/PermissionDialog";
import useApi from "../../../custom-hooks/useApi";
import { useToast } from "../../../custom-hooks/useToast";

function DobForm() {
  const { changeSignUpState, userSignUpDataState } = useAuthStore(
    (state) => state
  );

  const [dialog, setDialog] = useState(false);
  const [validAge, setValidAge] = useState<boolean>(false);
  const { handleToast } = useToast();
  const sendOtp = useApi({
    method: "POST",
    queryKey: ["sendOtp"],
    url: "/auth/otp",
  })?.post;
  const handleSubmit = async () => {
    if (validAge) {
      try {
        const email = userSignUpDataState.email;
        await sendOtp?.mutateAsync({ email });
        changeSignUpState(2);
      } catch (error: any) {
        handleToast(error.message, "error");
      }
    } else {
      setDialog(true);
    }
  };

  return (
    <form className="border p-4 space-y-5 text-center ">
      <PermissionDenied dialog={dialog} setDialog={setDialog} />
      <Img
        src={"/dobcake.svg"}
        width={150}
        height={150}
        alt="dobcake"
        className="mx-auto py-3"
      />
      <div className="flex justify-center !mt-0 ">
        <Text size="smsemibold" color="text-gray-900">
          Add your date of birth
        </Text>
      </div>
      <Text>This won't be a part of your public profile.</Text>
      <DatePicker setValidAge={setValidAge} />
      <div className=" flex flex-col  mx-auto gap-3 !mt-0">
        <Text color="text-gray-500" className="mt-2 !text-[12px]">
          You need to enter the date you were born on
        </Text>
        <Text color="text-gray-500" className=" !text-[12px]">
          Use your own date of birth, even if this account is for a business,
          pet or something else
        </Text>
      </div>
      <Button
        type="button"
        style="login"
        className="!w-11/12 mx-auto !mb-3 "
        onClick={handleSubmit}
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
    </form>
  );
}

export default DobForm;
