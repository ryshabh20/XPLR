"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { Messages } from "../lib/type";
import { useToast } from "./useToast";
import useChatStore from "@/store/chatStore";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

interface ISocketContext {
  sendMessage: (messageData: {
    recipientId: string;
    messageBody: string;
    conversationId: string;
    senderId: string;
  }) => any;
  joinRoom: (conversationId: string) => void;
  messages: Messages | undefined;
}
const SocketContext = createContext<ISocketContext | null>(null);
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Messages>();
  const client = useQueryClient();
  const newChatState = useChatStore((state) => state.newChatState);

  const onMessageReceived = useCallback(async (message: Messages) => {
    // console.log("this is the useSocket socket.id ", socket?.id);
    // console.log("this is the message received", message);
    // console.log("rahul", message);

    setMessages(message);
  }, []);

  useEffect(() => {
    console.log("newChatState.conversatinoId", newChatState);
    const _socket = io("http://localhost:8080");
    // console.log(first);
    _socket.on(newChatState.conversationId, onMessageReceived);
    _socket.on("private_chat_message", async () => {
      console.log("rish hello");
      await client.invalidateQueries({ queryKey: ["getConversations"] });
    });

    _socket.on("connect", () => {
      setSocket(_socket);
    });
    _socket.on("disconnect", () => {});
    return () => {
      _socket?.off("message");
      _socket.disconnect();
      setSocket(undefined);
    };
  }, [newChatState.conversationId]);
  const sendMessage: ISocketContext["sendMessage"] = (messageData) => {
    socket?.emit("event:message", messageData);
  };
  const joinRoom: ISocketContext["joinRoom"] = (conversationId) => {
    socket?.emit("join", conversationId);
  };
  return (
    <SocketContext.Provider value={{ sendMessage, messages, joinRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const { handleToast } = useToast();

  const state = useContext(SocketContext);
  if (!state) {
    handleToast("Socket is not initalized properly", "error");
  }
  return state;
};
