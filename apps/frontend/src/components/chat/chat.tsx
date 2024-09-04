import useChatStore from "@/store/chatStore";
import { Img } from "../common/img";
import Text from "../common/text";
import { MessageInput } from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useApi, { api } from "../../../custom-hooks/useApi";
import { useToast } from "../../../custom-hooks/useToast";
import { Messages } from "../../../lib/type";
import { useAuth } from "../../../custom-hooks/useAuth";
import { Message } from "./message";
import { socket } from "../../../socket";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
const Chat = () => {
  const newChatState = useChatStore((state) => state.newChatState);
  const [messages, setMessages] = useState<Messages[]>([]);
  const { user } = useAuth();
  const latestMessage = useRef<HTMLDivElement | null>(null);
  const topMessageBoxRef = useRef<HTMLDivElement | null>(null);
  const [pageParamsCounter, setPageParamsCounter] = useState(1);

  const { handleToast } = useToast();

  const getAllMessages = useInfiniteQuery({
    queryKey: [`getMessages${newChatState.conversationId}`],
    queryFn: ({ pageParam = 0 }) =>
      api(
        `/messages?filterId=${newChatState.conversationId}&cursor=${pageParam}`,
        "GET"
      ),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
  });
  const client = useQueryClient();

  useEffect(() => {
    socket.on("chat_message", async (data: Messages) => {
      await client.invalidateQueries({ queryKey: ["getConversations"] });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: data.id,
          latestMessageId: data.latestMessageId,
          conversationId: data.conversationId,
          senderId: data?.senderId,
          content: data?.content,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
      ]);
    });

    return () => {
      socket.off("chat_message");
    };
  }, []);

  const refetchChatHandler = async () => {
    try {
      const result = await getAllMessages?.fetchNextPage();
      const messages: any = [];

      result.data?.pages.map((page) =>
        page.data.map((message: any) => messages.push(message))
      );

      setMessages(messages.flat().toReversed());
    } catch (error) {
      handleToast("Error while fetching messages", "error");
    }
  };
  useEffect(() => {
    if (latestMessage.current) {
      latestMessage.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  useEffect(() => {
    const currentTopMessageBoxRef = topMessageBoxRef.current;

    const handleScroll = async () => {
      if (!currentTopMessageBoxRef) return;

      const { scrollTop, scrollHeight } = currentTopMessageBoxRef;

      if (
        scrollTop < 200 &&
        !getAllMessages.isFetchingNextPage &&
        getAllMessages.hasNextPage
      ) {
        const previousScrollHeight = scrollHeight;

        const result = await getAllMessages.fetchNextPage();

        setPageParamsCounter((prev) => prev + 1);
        setMessages([
          ...result.data?.pages[pageParamsCounter]?.data?.toReversed(),
          ...messages,
        ]);

        const newScrollHeight = currentTopMessageBoxRef.scrollHeight;

        currentTopMessageBoxRef.scrollTop =
          newScrollHeight - previousScrollHeight;
      }
    };

    if (currentTopMessageBoxRef) {
      currentTopMessageBoxRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentTopMessageBoxRef) {
        currentTopMessageBoxRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [getAllMessages]);

  useEffect(() => {
    const fetch = async () => {
      await refetchChatHandler();
    };
    fetch();
    setPageParamsCounter(1);
  }, [newChatState?.conversationId]);
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
        className={`w-full  justify-center items-center ${getAllMessages?.data?.pages[0].data.length !== 0 ? "hidden" : "flex"}`}
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
      <div className="  overflow-y-auto w-full h-max flex  flex-col flex-1 justify-end">
        <div className="h-max w-full overflow-y-auto">
          <div className="h-full w-full flex flex-col justify-end">
            <div
              className="w-full h-auto overflow-y-auto "
              ref={topMessageBoxRef}
            >
              {messages?.map((message: Messages) => {
                return (
                  <Message
                    key={message.id}
                    ref={message.latestMessageId ? latestMessage : null}
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
