import Button from "@/components/common/button";
import { Img } from "@/components/common/img";
import Text from "@/components/common/text";
import { SetStateAction } from "react";

const PermissionDenied = ({
  dialog,
  setDialog,
}: {
  dialog: boolean;
  setDialog: React.Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className={`w-[100%] h-[100%] absolute z-10 bg-gray-800  inset-0  justify-center items-center bg-opacity-30 ${
        dialog ? "flex" : "hidden"
      }`}
    >
      <div className="border w-[22rem] bg-white  rounded-lg absolute ">
        <div className="flex  justify-between p-2 text-center border-b pb-1">
          {" "}
          <Text size="xssemibold" color="text-black" className="mx-auto">
            Problem while creating your Account
          </Text>
          <Img
            src="/cross.svg"
            className="hover:cursor-pointer"
            width={15}
            height={15}
            alt="cross"
            onClick={() => setDialog(false)}
          />
        </div>
        <div className="flex w-full  justify-center items-center h-36">
          <Img src="/lock.svg" width={80} height={80} alt="lock-icon" />
        </div>
        <div className="border-b">
          <Text
            color="text-gray-600"
            className="!text-[12px] leading-none tracking-tighter whitespace-nowrap "
          >
            You can't sign up for xplr based on the information you've provided
          </Text>
        </div>
        <Button
          type="button"
          style="login"
          className="!w-11/12 mx-auto !mb-3"
          onClick={() => setDialog(false)}
        >
          OK
        </Button>
      </div>
    </div>
  );
};

export default PermissionDenied;
