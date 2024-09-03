import useApi from "../../../custom-hooks/useApi";
import Text from "../common/text";
import ConversationUserCard from "./conversationusercard";

export interface Conversation {
  id: string;
  creatorId: string;
  isGroup: boolean;
  title: null;
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
            avatar={conversation?.latestMessage?.sender?.avatar}
            fullname={conversation?.participant[0].user?.fullname}
            conversationId={conversation?.id}
            latestMessage={conversation?.latestMessage?.content}
            username={conversation?.participant[0]?.user?.username}
            id={conversation?.participant[0]?.user?.username}
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
