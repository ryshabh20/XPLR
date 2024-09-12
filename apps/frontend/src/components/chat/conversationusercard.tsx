import useChatStore from "@/store/chatStore";
import { Img } from "../common/img";
import Text from "../common/text";
import { useQueryClient } from "@tanstack/react-query";
interface ConversationUserCardProps {
  fullname: string;
  conversationId: string;
  latestMessage: string;
  avatar: string;
  username: string;
  id: string;
  isGroup: boolean;
  groupAvatar: string[];
}
export default function ConversationUserCard({
  fullname,
  latestMessage,
  avatar,
  conversationId,
  username,
  id,
  isGroup,
  groupAvatar,
}: ConversationUserCardProps) {
  const { changeChatState, changeNewChatState, newChatState } = useChatStore(
    (state) => state
  );

  const queryClient = useQueryClient();
  const handleClick = () => {
    queryClient.invalidateQueries({
      queryKey: [`getMessages${conversationId}`],
    });
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
      className={`flex space-x-4 px-6 justify-self-center w-full   h-[90px] hover:cursor-pointer  ${newChatState.conversationId !== conversationId && "hover:bg-neutral-800  "}  py-4  ${newChatState.conversationId === conversationId && "bg-neutral-700  "}`}
      onClick={handleClick}
    >
      <Img
        src={avatar ? avatar : "/profile.svg"}
        alt="avatar"
        width={50}
        height={50}
        className={`h-20 w-20 mobile:h-14 mobile:w-14   rounded-full self-center flex-1 ${isGroup && "hidden"}`}
      />
      {isGroup && (
        <div className="relative  w-14 !ml-0 ">
          <Img
            src={groupAvatar[0] ? groupAvatar[0] : "/profile.svg"}
            alt="participant1"
            width={50}
            height={50}
            className={` rounded-full self-center flex-1 absolute`}
          />
          <Img
            src={groupAvatar[0] ? groupAvatar[0] : "/profile.svg"}
            alt="participant2"
            width={50}
            height={50}
            className={` rounded-full self-center flex-1 absolute inset-x-2 top-3`}
          />
        </div>
      )}

      <div
        className={`mobile:flex w-full justify-center truncate flex-col gap-1 hidden  ${isGroup && "!ml-0 pl-6"} `}
      >
        <Text size="base" className={`h-5 rounded-sm text-white text-ellipsis`}>
          {fullname}
        </Text>
        <Text
          size="base"
          className={`h-6 truncate rounded-sm  text-neutral-500  `}
        >
          {latestMessage}
        </Text>
      </div>
    </div>
  );
}
