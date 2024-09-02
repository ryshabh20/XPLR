import { FieldValues, useForm } from "react-hook-form";
import Input from "../common/input";
import Text from "../common/text";
import Button from "../common/button";
import useApi from "../../../custom-hooks/useApi";
import useChatStore from "@/store/chatStore";

export const MessageInput = () => {
  const { control, handleSubmit } = useForm({});
  const chatStore = useChatStore((state) => state.newChatState);
  const sendMessage = useApi({
    method: "POST",
    queryKey: ["sendMessage"],
    url: "/messages/send",
  })?.post;
  const messageHandler = async (data: FieldValues) => {
    const newMessage = await sendMessage?.mutateAsync({
      recipientId: chatStore.id,
      messageBody: data.message,
      conversationId: chatStore.conversationId,
    });
  };
  return (
    <form className="w-full px-4" onSubmit={handleSubmit(messageHandler)}>
      <Input
        name="message"
        className="w-full px-5 bg-transparent  !flex-row border border-neutral-700 self-center rounded-3xl "
        inputClassName=" px-5   self-center !border-none bg-transparent whitespace-pre text-pretty  text-white min-h-[3.25rem] outline-none"
        control={control}
        suffix={
          <Button
            type={"button"}
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
