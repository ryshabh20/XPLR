import { FieldValues, useForm } from "react-hook-form";
import Input from "../common/input";
import Text from "../common/text";
import Button from "../common/button";

import useChatStore from "@/store/chatStore";
import { socket } from "../../../socket";
import { useAuth } from "../../../custom-hooks/useAuth";
import { useRef } from "react";
import { Img } from "../common/img";
import useDrivePicker from "react-google-drive-picker";

export const MessageInput = () => {
  const { control, handleSubmit, reset } = useForm({});
  const chatStore = useChatStore((state) => state.newChatState);
  const inputMessage = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [openPicker, authResponse] = useDrivePicker();

  const messageHandler = async (data: FieldValues) => {
    socket.emit("chat_message", {
      recipientId: chatStore.id,
      messageBody: data.message,
      conversationId: chatStore.conversationId,
      senderId: user?.id,
    });
    reset();
    if (inputMessage.current) {
      inputMessage.current.value = "";
    }
  };
  const handleOpenPicker = () => {
    openPicker({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      developerKey: process.env.NEXT_PUBLIC_DEVELOPER_KEY as string,
      viewId: "DOCS_IMAGES",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,

      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
      },
    });
  };
  return (
    <form className="w-full px-4" onSubmit={handleSubmit(messageHandler)}>
      <Input
        name="message"
        prefixIcon={
          <Img
            src="/drive_icon.svg"
            height={30}
            width={30}
            alt="drive"
            className="hover:cursor-pointer"
            onClick={handleOpenPicker}
          />
        }
        ref={inputMessage}
        className="w-full px-5 bg-transparent  !flex-row border border-neutral-700 self-center rounded-3xl "
        inputClassName=" px-5   self-center !border-none bg-transparent whitespace-pre text-pretty  text-white min-h-[3.25rem] outline-none"
        control={control}
        suffix={
          <Button
            type={"submit"}
            className="bg-transparent p-0 max-w-fit !mt-0 flex items-center h-full"
          >
            {" "}
            <Text size="smsemibold" className="text-blue-400">
              Send
            </Text>
          </Button>
        }
        placeholder="Message..."
      />
    </form>
  );
};
