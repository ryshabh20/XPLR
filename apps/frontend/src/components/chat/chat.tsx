import useChatStore from "@/store/chatStore";
import { Img } from "../common/img";
import Text from "../common/text";
import { MessageInput } from "./MessageInput";
import { useEffect, useState } from "react";
import useApi from "../../../custom-hooks/useApi";
import { useToast } from "../../../custom-hooks/useToast";
import { Messages } from "../../../lib/type";
import { useAuth } from "../../../custom-hooks/useAuth";
import { Message } from "./message";
const Chat = () => {
  const newChatState = useChatStore((state) => state.newChatState);
  const [messages, setMessages] = useState();
  const { user } = useAuth();
  const chatState = useChatStore((state) => state.newChatState);
  const { handleToast } = useToast();
  const getAllConversations = useApi({
    method: "GET",
    url: `/messages?filterId=${newChatState.conversationId}`,
    queryKey: ["gettAllMessages"],
  })?.get;
  const refetchChatHandler = async () => {
    try {
      const result = await getAllConversations?.refetch();
      setMessages(result?.data?.data);
    } catch (error) {
      handleToast("Error while fetching messages", "error");
    }
  };
  useEffect(() => {
    const fetch = async () => {
      await refetchChatHandler();
    };
    fetch();
  }, [chatState?.conversationId]);
  return (
    <div className=" w-[calc(100%-104px)] mobile:w-[calc(100%-368px)] h-full flex  flex-col  flex-shrink pb-4 ">
      <div className="flex justify-between p-4 border-b-[1px] border-b-neutral-700">
        <div className="flex items-center gap-4">
          <Img src={newChatState.avatar} alt="profile" height={45} width={45} />
          <Text size="base" className="text-white">
            {newChatState.fullname}
          </Text>
        </div>
        <Img src="/info.svg" alt="profile" height={25} width={25} />
      </div>
      <div
        className={`w-full  justify-center items-center ${getAllConversations?.data?.data?.length !== 0 ? "hidden" : "flex"}`}
      >
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
      <div className="  overflow-y-auto w-full h-max flex  flex-col flex-1 items-end">
        <div className="h-max w-full overflow-y-auto">
          <div className="h-full w-full flex flex-col justify-end">
            <div className="w-full h-auto overflow-y-auto">
              {getAllConversations?.data?.data?.map((message: Messages) => {
                return (
                  <Message
                    isUserDifferent={user?.id !== message.senderId}
                    message={message?.content}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <MessageInput />
    </div>
  );
};

export { Chat };
