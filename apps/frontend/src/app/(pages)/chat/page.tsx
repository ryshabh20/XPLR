"use client";
import FriendList from "@/components/chat/friendlist";
import Text from "@/components/common/text";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../custom-hooks/useAuth";
import { ChatConversations } from "@/components/chat/chatconversation";
import { Chat } from "@/components/chat/chat";
import useChatStore from "@/store/chatStore";

export default function Page() {
  const { user } = useAuth();
  const chatState = useChatStore((state) => state.chatState);
  return (
    <div className="h-full w-full flex">
      <FriendList />
      {chatState === 0 && <ChatConversations />}
      {chatState === 1 && <Chat />}
    </div>
  );
}
