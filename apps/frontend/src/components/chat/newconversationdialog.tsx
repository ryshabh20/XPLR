import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { Img } from "../common/img";
import Text from "../common/text";
import Button from "../common/button";
import Input from "../common/input";
import { ControllerRenderProps, FieldValues, useForm } from "react-hook-form";
import useApi from "../../../custom-hooks/useApi";
import { useToast } from "../../../custom-hooks/useToast";
import { useEffect, useRef, useState } from "react";
import MessageUserCard from "./messageusercard";
import useChatStore from "@/store/chatStore";

export default function NewConversationDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { control, reset, watch } = useForm();
  const { changeChatState, changeNewChatState } = useChatStore(
    (state) => state
  );
  const [users, setUsers] = useState<
    { fullname: string; username: string; avatar: string; id: string }[]
  >([]);
  const [recipientUser, setRecipientUser] = useState<
    {
      username: string;
      id: string;
    }[]
  >([]);
  const getAllUsers = useApi({
    method: "POST",
    queryKey: ["getAllUsers"],
    url: "/users",
  })?.post;

  const createGroupConversation = useApi({
    method: "POST",
    queryKey: ["getConversations"],
    url: "/conversations/newgroup",
  })?.post;

  const checkConversationExists = useApi({
    method: "POST",
    queryKey: ["startNewConversation"],
    url: "/conversations/status",
  })?.post;
  const { handleToast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceSearchUser =
    (field: ControllerRenderProps<FieldValues, string>, checkWhat: string) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        if (!e.target.value) {
          field.onChange(e.target.value);
          setUsers([]);
          return;
        }
        const users = await getAllUsers?.mutateAsync({ text: e.target.value });
        if (!!users?.data?.data.length) {
          setUsers(users?.data?.data);
        }
        field.onChange(e.target.value);
      } catch (error) {
        console.log(error);
        handleToast("Error Accessing the Database", "error");
      }
    };

  const checkChatHandler = async () => {
    try {
      if (recipientUser.length === 1) {
        const result = await checkConversationExists?.mutateAsync({
          recipientId: recipientUser[0],
        });
        const filteredUser = users.find(
          (user) => user.id === recipientUser[0].id
        );
        changeChatState(1);
        changeNewChatState({
          fullname: filteredUser?.fullname || "",
          avatar: filteredUser?.avatar || "/profile.svg",
          id: filteredUser?.id || "",
          username: filteredUser?.username || "",
          conversationId: result?.data?.data?.id || "",
        });
        setIsOpen(false);
        return;
      }

      const filteredUsers = users.filter((user) => {
        if (
          recipientUser.findIndex(
            (item) => item.id === user.id && item.username === user.username
          ) !== -1
        ) {
          return user;
        }
      });
      const result = await createGroupConversation?.mutateAsync({
        recipientIds: recipientUser.map((recipientUser) => recipientUser.id),
      });
      setUsers([]);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      handleToast("Error Accessing the Database", "error");
    }
  };
  const inputSearchClear = () => {
    reset({ searchUserForChat: "" });
    setUsers([]);
  };
  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.focus();
  }, [setIsOpen]);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open dialog</button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className=" sm:min-w-[512px] space-y-4  bg-neutral-800  rounded-xl ">
            <div className="flex items-center justify-between p-6">
              <DialogTitle className="font-bold text-center place-self-center text-white flex-grow">
                New Message
              </DialogTitle>
              <Img
                src="/white_cross.svg"
                className="hover:cursor-pointer justify-self-end"
                width={15}
                height={15}
                alt="cross"
                onClick={() => setIsOpen(false)}
              />
            </div>

            <Description className="border-y-[1px] px-4 py-2 !mt-0 border-y-neutral-700 flex items-center ">
              <Text size="basesemibold" className="text-white">
                To:
              </Text>
              <Input
                name={"searchUserForChat"}
                control={control}
                ref={inputRef}
                innerDivClassName="flex flex-wrap gap-1 px-2 max-h-[200px]  overflow-y-auto "
                changeHandler={debounceSearchUser}
                inputContent={
                  <>
                    {recipientUser.map((user) => (
                      <Text
                        key={user.id}
                        className="bg-blue-400 px-2 py-1 rounded-md  text-white "
                      >
                        {user.username}
                      </Text>
                    ))}
                  </>
                  // </div>
                }
                time={500}
                placeholder="Search..."
                className="w-full flex  "
                inputClassName="bg-transparent border-none outline-none text-white "
              />
            </Description>

            {users && users.length > 0 ? (
              <Description
                className={"min-h-[240px] max-h-[424px]  !mt-0 overflow-y-auto"}
              >
                {users?.map((user) => (
                  <MessageUserCard
                    key={user.id}
                    setRecipientUser={setRecipientUser}
                    inputSearchClear={inputSearchClear}
                    recipientUser={recipientUser}
                    id={user.id}
                    fullname={user.fullname}
                    username={user.username}
                    avatar={user.avatar}
                  />
                ))}
              </Description>
            ) : (
              <div className=" px-4 py-2  min-h-[280px] max-h-[424px] ">
                <Text size="md" className="text-white">
                  No Account found
                </Text>
              </div>
            )}
            <div className="p-2">
              <Button className="py-2" onClick={checkChatHandler}>
                Chat
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
