import { useEffect, useState } from "react";
import { Img } from "../common/img";
import clsx from "clsx";
import Text from "../common/text";

interface MessageUserCardProps {
  fullname: string;
  setRecipientUser: React.Dispatch<
    React.SetStateAction<
      {
        username: string;
        id: string;
      }[]
    >
  >;
  recipientUser: {
    username: string;
    id: string;
  }[];
  username: string;
  avatar: string;
  id: string;
  inputSearchClear: () => void;
}

export default function MessageUserCard({
  fullname,
  username,
  avatar,
  setRecipientUser,
  recipientUser,
  inputSearchClear,
  id,
}: MessageUserCardProps) {
  const [isChecked, setIsChecked] = useState<string>("");
  const handleClick = () => {
    if (isChecked === id) {
      const removedIdFromRecipientUser = recipientUser.filter(
        (user) => user.id !== isChecked
      );
      setIsChecked("");
      setRecipientUser(removedIdFromRecipientUser);
      return;
    }

    setIsChecked(id);
    setRecipientUser([...recipientUser, { username, id }]);
    inputSearchClear();
  };
  useEffect(() => {
    if (recipientUser.findIndex((user) => user.id === id) !== -1) {
      setIsChecked(id);
    }
  }, [id]);
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
