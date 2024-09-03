import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { HttpStatusCode } from "axios";

export const CreateNewConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const creatorId = req.user?.id;
  const { recipientId } = req.body;
  const participants = [creatorId, recipientId];

  const existingConversation = await prisma.participant.findFirst({
    where: {
      userId: creatorId,
      conversation: {
        isGroup: false,
        participant: {
          some: { userId: recipientId },
        },
      },
    },
  });
  if (existingConversation) {
    return res.status(HttpStatusCode.Conflict).json({
      message: "Conversation already exists",
      data: {
        id: existingConversation.conversationId,
      },
    });
  }

  const newConversation = await prisma.conversation.create({
    data: {
      creatorId,
      participant: {
        create: participants.map((participant) => ({
          user: { connect: { id: participant } },
        })),
      },
    },
  });

  return res.json({
    message: "Successfully created the conversation",
    data: {
      id: newConversation.id,
    },
  });
};
export const checkConversationExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const creatorId = req.user?.id;
  const { recipientId } = req.body;

  const existingConversation = await prisma.participant.findFirst({
    where: {
      userId: creatorId,
      conversation: {
        isGroup: false,
        participant: {
          some: { userId: recipientId },
        },
      },
    },
  });
  return res.status(HttpStatusCode.Ok).json({
    message: "Conversation exists",
    data: {
      id: existingConversation?.conversationId,
    },
  });
};

export const getAllConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const creatorId = req.user?.id;

  const allConversations = await prisma.conversation.findMany({
    where: {
      participant: {
        some: {
          userId: creatorId,
        },
      },
    },

    include: {
      latestMessage: {
        select: {
          content: true,
          sender: {
            select: {
              avatar: true,
            },
          },
        },
      },
      participant: {
        where: { NOT: { userId: creatorId } },
        select: {
          user: { select: { fullname: true, id: true, username: true } },
        },
      },
    },
    orderBy: {
      latestMessage: {
        createdAt: "desc",
      },
    },
  });

  const conversations = !!allConversations?.length ? allConversations : [];
  return res.json({
    message: "All conversations Fetched",
    data: allConversations,
  });
};
