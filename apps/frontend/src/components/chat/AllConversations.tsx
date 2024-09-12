import useChatStore from "@/store/chatStore";
import useApi from "../../../custom-hooks/useApi";
import Text from "../common/text";
import ConversationUserCard from "./conversationusercard";

export interface Conversation {
  id: string;
  creatorId: string;
  isGroup: boolean;
  title: null;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  latestMessage: LatestMessage;
  participant: Participant[];
}
export interface LatestMessage {
  content: string;
  sender: Sender;
}

export interface Sender {
  avatar: string;
}

export interface Participant {
  user: User;
}

export interface User {
  fullname: string;
  avatar: string;
  id: string;
  username: string;
}
export default function AllConversations() {
  const getConversations = useApi({
    method: "GET",
    queryKey: ["getConversations"],
    url: "/conversations",
  })?.get;

  return (
    <div className="w-full flex flex-col flex-1 ">
      <div className="w-full justify-between  hidden mobile:flex px-6 mb-2">
        <Text size="basesemibold" className="text-white">
          Messages
        </Text>
        <Text size="basesemibold" className="text-neutral-500">
          Requests
        </Text>
      </div>
      {!!getConversations?.data?.data.length ? (
        getConversations?.data?.data.map((conversation: Conversation) => (
          <ConversationUserCard
            key={conversation.id}
            avatar={
              conversation.isGroup
                ? conversation?.avatar ||
                  conversation?.latestMessage?.sender?.avatar
                : conversation?.latestMessage?.sender?.avatar
            }
            groupAvatar={
              conversation.isGroup && [
                conversation.participant[conversation.participant.length - 1]
                  .user.avatar,
                conversation.participant[conversation.participant.length - 2]
                  .user.avatar,
              ]
            }
            fullname={
              conversation.isGroup
                ? conversation.participant
                    .map((p) => p.user.fullname)
                    .join(" , ")
                : conversation?.participant[0].user?.fullname
            }
            conversationId={conversation?.id}
            latestMessage={
              conversation?.latestMessage?.content
                ? conversation?.latestMessage?.content
                : `You added ${conversation.participant[conversation.participant.length - 1].user.fullname} to the group.`
            }
            username={conversation?.participant[0]?.user?.username}
            id={conversation?.participant[0]?.user?.username}
            isGroup={conversation.isGroup}
          />
        ))
      ) : (
        <div className="  flex justify-center items-center h-full">
          <Text size="base" className="text-white hidden mobile:block">
            No Messages found.
          </Text>
        </div>
      )}
    </div>
  );
}
