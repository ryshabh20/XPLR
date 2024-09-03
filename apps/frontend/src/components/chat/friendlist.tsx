import { useState } from "react";
import { useAuth } from "../../../custom-hooks/useAuth";
import { SearchUserLoader } from "../../../custom-loaders/search-user-loader";
import { Img } from "../common/img";
import Text from "../common/text";
import ChatNotes from "./chatnotes";

import NewConversationDialog from "./newconversationdialog";
import AllConversations from "./AllConversations";

export default function FriendList() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-[104px] mobile:w-3-4  h-full  pt-9 border-r-[1px] border-r-neutral-800 flex-shrink-0">
      <div className="pb-3 h-full flex flex-col">
        <div className="flex justify-center mobile:justify-between px-6">
          <Text size="mdsemibold" className="text-white hidden mobile:block">
            {user?.username.includes("@gmail")
              ? user.username.split("@")[0]
              : user?.username}
          </Text>
          <Img
            src={"/new_conversation.svg"}
            width={25}
            height={25}
            alt="home-icon"
            className="hover:cursor-pointer "
            onClick={() => setIsOpen(true)}
          />
        </div>
        <NewConversationDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        <ChatNotes />
        <AllConversations />
      </div>
    </div>
  );
}
