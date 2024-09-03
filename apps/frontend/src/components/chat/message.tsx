import clsx from "clsx";
import Text from "../common/text";
import { forwardRef, useEffect, useRef } from "react";

export type Ref = HTMLDivElement;

interface Props {
  isUserDifferent: boolean;
  message?: string;
}

export const Message = forwardRef<Ref, Props>(
  ({ isUserDifferent, message }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("w-full flex text-wrap px-4 py-2", {
          "!hidden": !message,
          "justify-end": !isUserDifferent,
        })}
      >
        <div
          className={clsx("w-1/2 flex justify-end  !text-left  pl-4", {
            "!justify-start w-1/2 !text-left pl-0": isUserDifferent,
          })}
        >
          <Text className="text-white bg-blue-400 p-2 rounded-xl break-all text-left ">
            {" "}
            {message}
          </Text>
        </div>
      </div>
    );
  }
);
