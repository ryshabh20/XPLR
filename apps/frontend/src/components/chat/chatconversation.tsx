import { useState } from "react";
import Button from "../common/button";
import { Img } from "../common/img";
import Text from "../common/text";
import NewConversationDialog from "./newconversationdialog";

export const ChatConversations = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-dvh flex justify-center items-center flex-col gap-2 flex-shrink ">
      <Img
        alt="Send Message"
        src="/send_message.svg"
        height={100}
        width={100}
      ></Img>
      <Text className="text-white mt-4">Your Messages</Text>
      <Text size="base" className="text-gray-400 whitespace-normal text-center">
        Send private photos and messages to a friend or group.
      </Text>

      <div>
        <Button
          className="!p-2 rounded-lg text-sm bg-blue-500"
          onClick={() => setIsOpen(true)}
        >
          Send Message
        </Button>
        <NewConversationDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
};
