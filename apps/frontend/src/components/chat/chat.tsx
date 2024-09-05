import useChatStore from "@/store/chatStore";
import { Img } from "../common/img";
import Text from "../common/text";
import { MessageInput } from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../custom-hooks/useApi";
import { useToast } from "../../../custom-hooks/useToast";
import { Messages } from "../../../lib/type";
import { useAuth } from "../../../custom-hooks/useAuth";
import { socket } from "../../../socket";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Message } from "./message";
import isLastWeek from "../../../utils/isLastWeek";
import { groupEnd } from "console";
const Chat = () => {
  const newChatState = useChatStore((state) => state.newChatState);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [groupedEntries, setGroupedEntries] = useState<
    Partial<Record<string, Messages[]>>
  >({});
  const { user } = useAuth();
  const latestMessage = useRef<HTMLDivElement | null>(null);
  const topMessageBoxRef = useRef<HTMLDivElement | null>(null);
  const [pageParamsCounter, setPageParamsCounter] = useState(1);

  const { handleToast } = useToast();

  const getAllMessages = useInfiniteQuery<{
    data: Messages[];
    hasNextPage: boolean;
    nextCursor: string;
  }>({
    queryKey: [`getMessages${newChatState.conversationId}`],
    queryFn: ({ pageParam = 0 }) =>
      api(
        `/messages?filterId=${newChatState.conversationId}&cursor=${pageParam}`,
        "GET"
      ),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
  });
  const client = useQueryClient();
  const dateOptions = (date: Date) => {
    const options = isLastWeek(date)
      ? { year: "numeric", month: "short", day: "numeric" }
      : { month: "short", day: "numeric" };
    return options;
  };

  useEffect(() => {
    socket.on("chat_message", async (data: Messages) => {
      const options = dateOptions(data.createdAt);
      const filterKey = new Date(data.createdAt).toLocaleDateString(
        undefined,
        options as any
      );
      await client.invalidateQueries({ queryKey: ["getConversations"] });
      setGroupedEntries((prevMessages) => {
        const updatedMessages = {
          ...prevMessages,
          [filterKey]: prevMessages[filterKey]
            ? [
                ...prevMessages[filterKey],
                {
                  id: data.id,
                  latestMessageId: data.latestMessageId,
                  conversationId: data.conversationId,
                  senderId: data?.senderId,
                  content: data?.content,
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                },
              ]
            : [
                {
                  id: data.id,
                  latestMessageId: data.latestMessageId,
                  conversationId: data.conversationId,
                  senderId: data?.senderId,
                  content: data?.content,
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                },
              ],
        };
        console.log("this is the updatedMessages", updatedMessages);
        return updatedMessages;
      });
    });

    return () => {
      socket.off("chat_message");
    };
  }, []);

  const refetchChatHandler = async () => {
    try {
      const result = await getAllMessages?.fetchNextPage();
      const messages: Array<Messages> = [];

      result.data?.pages.map((page) =>
        page.data?.map((message: Messages) => messages.push(message))
      );
      const FlatReversedMessages = messages.flat().toReversed();

      const groupedBy = Object.groupBy(
        FlatReversedMessages,
        ({ createdAt }) => {
          const options = dateOptions(createdAt);
          return new Date(createdAt).toLocaleDateString(
            undefined,
            options as any
          );
        }
      );
      setGroupedEntries(groupedBy);
      setMessages(FlatReversedMessages);
    } catch (error) {
      console.log(error);
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
        const resultArray =
          result?.data?.pages[pageParamsCounter]?.data?.toReversed();
        const groupedBy =
          resultArray &&
          Object.groupBy(resultArray, ({ createdAt }) => {
            const options = dateOptions(createdAt);
            return new Date(createdAt).toLocaleDateString(
              undefined,
              options as any
            );
          });

        setPageParamsCounter((prev) => prev + 1);

        setGroupedEntries((prevEntries) => {
          if (!groupedBy) return prevEntries;

          const updatedEntries = { ...prevEntries };

          Object.keys(groupedBy).forEach((filterKey) => {
            if (updatedEntries[filterKey]) {
              updatedEntries[filterKey] = [
                ...groupedBy[filterKey]!,
                ...updatedEntries[filterKey],
              ];
            } else {
              updatedEntries[filterKey] = groupedBy[filterKey];
            }
          });

          return updatedEntries;
        });

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
        className={`w-full  justify-center items-center ${getAllMessages?.data?.pages[0]?.data?.length !== 0 ? "hidden" : "flex"}`}
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
              {Object.keys(groupedEntries)?.map((date) => {
                return (
                  <div className="w-full">
                    <div className="flex justify-center">
                      <Text
                        size="basesemibold"
                        className="text-neutral-500 w-full text-center py-3"
                      >
                        {date}
                      </Text>
                    </div>
                    <div>
                      {groupedEntries[date]?.map((message) => (
                        <Message
                          key={message.id}
                          ref={message.latestMessageId ? latestMessage : null}
                          isUserDifferent={user?.id !== message.senderId}
                          message={message?.content}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* {messages?.map((message: Messages) => {
                return (
                  <Message
                    key={message.id}
                    ref={message.latestMessageId ? latestMessage : null}
                    isUserDifferent={user?.id !== message.senderId}
                    message={message?.content}
                  />
                );
              })} */}
            </div>
          </div>
        </div>
      </div>
      <MessageInput />
    </div>
  );
};

export { Chat };
