import useChatStore from "@/store/chatStore";
import { Img } from "../common/img";
import Text from "../common/text";
import { MessageInput } from "./MessageInput";
const Chat = () => {
  const newChatState = useChatStore((state) => state.newChatState);

  return (
    <div className="w-full h-full flex  flex-col  flex-shrink pb-4 ">
      <div className="flex justify-between p-4 border-b-[1px] border-b-neutral-700">
        <div className="flex items-center gap-4">
          <Img src={newChatState.avatar} alt="profile" height={45} width={45} />
          <Text size="base" className="text-white">
            {newChatState.fullname}
          </Text>
        </div>
        <Img src="/info.svg" alt="profile" height={25} width={25} />
      </div>
      <div className="w-full flex justify-center items-center">
        <div className=" flex flex-col items-center  gap-1 py-10">
          <Img src={newChatState.avatar} alt="profile" height={90} width={90} />
          <Text size="lgsemibold" className="text-white">
            {newChatState.fullname}
          </Text>
          <Text className="text-neutral-500">
            {newChatState.username} · XPLR
          </Text>
        </div>
      </div>
      <div className="messages h-full flex-1"></div>
      <MessageInput />
    </div>
  );
};

export { Chat };
