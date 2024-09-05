import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { errorHandler } from "../../utils/errorHandler";
import { HttpStatusCode } from "axios";

export const SendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const senderId = req.user.id;
  const { recipientId, messageBody, conversationId } = req.body;

  try {
    const createNewMessage = async (conversationId: string) => {
      const messageCreated = await prisma.message.create({
        data: {
          content: messageBody,
          conversation: {
            connect: {
              id: conversationId,
            },
          },
          sender: {
            connect: {
              id: senderId,
            },
          },

          latestMessage: {
            connect: {
              id: conversationId,
            },
          },
        },
      });

      return messageCreated;
    };

    if (!conversationId) {
      const participants = [recipientId, senderId];
      const createConversation = await prisma.conversation.create({
        data: {
          creatorId: senderId,

          participant: {
            create: participants.map((participant) => ({
              user: { connect: { id: participant } },
            })),
          },
        },
      });
      const message = createNewMessage(createConversation.id);
      return res.json({
        message: "Conversation Created and Message sent successfully",
      });
    }
    const message = createNewMessage(conversationId);
    return res.json({ message: "Message Sent" });
  } catch (error) {
    console.log(error);
    errorHandler(HttpStatusCode.BadRequest, "Couldn't send message try again");
  }
};

export const getAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { filterId } = req.query;
  const cursor = req.query.cursor;

  const pageSize = parseInt(req.query.pageSize as string) || 20;

  if (!filterId) {
    return res.json({
      message: "All Messages fetched",
      data: [],
    });
  }

  const allMessages = await prisma.message.findMany({
    skip: cursor !== "0" ? 1 : 0,
    cursor: cursor !== "0" ? { id: cursor as string } : undefined,
    take: 20,
    where: {
      conversationId: filterId as string,
    },
    include: {
      latestMessage: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(
    allMessages.length - 1,

    allMessages[allMessages.length - 1]?.id,

    allMessages[allMessages.length - 1]?.id
  );

  const nextCursor =
    allMessages.length === pageSize
      ? allMessages[allMessages.length - 1]?.id
      : null;

  return res.json({
    message: "All Messages fetched",
    data: allMessages,
    nextCursor,
  });
};

export const MessageCreator = async ({
  messageBody,
  conversationId,
  senderId,
  recipientId,
}: {
  messageBody: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
}) => {
  try {
    const createNewMessage = async (conversationId: string) => {
      const messageCreated = await prisma.message.create({
        data: {
          content: messageBody,
          conversation: {
            connect: {
              id: conversationId,
            },
          },
          sender: {
            connect: {
              id: senderId,
            },
          },

          latestMessage: {
            connect: {
              id: conversationId,
            },
          },
        },
      });

      return messageCreated;
    };

    if (!conversationId) {
      const participants = [recipientId, senderId];
      const createConversation = await prisma.conversation.create({
        data: {
          creatorId: senderId,

          participant: {
            create: participants.map((participant) => ({
              user: { connect: { id: participant } },
            })),
          },
        },
      });
      const message = createNewMessage(createConversation.id);
      return message;
    }
    const message = createNewMessage(conversationId);
    return message;
  } catch (error) {
    console.log(error);
    errorHandler(HttpStatusCode.BadRequest, "Couldn't send message try again");
  }
};
