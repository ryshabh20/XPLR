import { useState } from "react";
import { Img } from "../common/img";
import clsx from "clsx";
import Text from "../common/text";

export default function MessageUserCard({
  fullname,
  username,
  avatar,
  setRecipientUserId,
  id,
}: {
  fullname: string;
  setRecipientUserId: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  avatar: string;
  id: string;
}) {
  const [isChecked, setIsChecked] = useState<string>("");
  const handleClick = () => {
    if (isChecked === id) {
      setIsChecked("");
      setRecipientUserId("");
      return;
    }

    setIsChecked(id);
    setRecipientUserId(id);
  };

  return (
    <div
      className="flex space-x-4 mb-4 px-5   hover:cursor-pointer hover:bg-neutral-700 py-4 "
      onClick={handleClick}
    >
      <Img
        src={avatar ? avatar : "/profile.svg"}
        alt="avatar"
        width={50}
        height={50}
        className={`h-10 w-10 rounded-full self-center flex-0 `}
      />

      <div className="flex flex-col gap-1 sm:w-full  ">
        <Text size="base" className={`h-4 rounded-sm text-white text-ellipsis`}>
          {fullname}
        </Text>
        <Text
          size="base"
          className={`h-4 rounded-sm  text-neutral-500 text-ellipsis`}
        >
          {username}
        </Text>
      </div>
      <div
        className={clsx(
          "w-6  h-6 flex-none self-center rounded-full border-2 border-gray-400 flex items-center justify-center cursor-pointer",
          {
            "bg-white ": isChecked,
          }
        )}
      >
        {isChecked && <span className="!text-red-500 text-mini">✔️</span>}
      </div>
    </div>
  );
}
