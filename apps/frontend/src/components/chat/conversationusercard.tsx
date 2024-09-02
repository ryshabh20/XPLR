import useChatStore from "@/store/chatStore";
import { Img } from "../common/img";
import Text from "../common/text";
export default function ConversationUserCard({
  fullname,
  latestMessage,
  avatar,
  conversationId,
  username,
  id,
}: {
  fullname: string;
  conversationId: string;
  latestMessage: string;
  avatar: string;
  username: string;
  id: string;
}) {
  const { changeChatState, changeNewChatState } = useChatStore(
    (state) => state
  );
  const handleClick = () => {
    changeChatState(1);
    changeNewChatState({
      fullname: fullname || "",
      avatar: avatar || "/profile.svg",
      id: id || "",
      username: username || "",
      conversationId: conversationId || "",
    });
  };
  return (
    <div
      className="flex space-x-4 justify-self-center w-full  hover:cursor-pointer hover:bg-neutral-700 py-4 "
      onClick={handleClick}
    >
      <Img
        src={avatar ? avatar : "/profile.svg"}
        alt="avatar"
        width={50}
        height={50}
        className={`h-20 w-20 mobile:h-14 mobile:w-14 rounded-full self-center flex-1 `}
      />

      <div className="mobile:flex w-full truncate flex-col gap-1 hidden   ">
        <Text size="base" className={`h-5 rounded-sm text-white text-ellipsis`}>
          {fullname}
        </Text>
        <Text
          size="base"
          className={`h-5 truncate rounded-sm  text-neutral-500`}
        >
          {latestMessage}
        </Text>
      </div>
    </div>
  );
}
