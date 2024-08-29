import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { isErrored } from "stream";
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
          isRead: false,
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
