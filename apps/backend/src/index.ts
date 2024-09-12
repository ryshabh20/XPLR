import "./instrument";
import "express-async-errors";
import express, { Express, NextFunction, Request, Response } from "express";
import authRouter from "./routes/auth.route";
import conversationRouter from "./routes/conversations.route";
import messageRouter from "./routes/messages.route";
import userRouter from "./routes/users.route";

import dotnev from "dotenv";
import cors from "cors";
import { createClient } from "redis";
import { OAuth2Client } from "google-auth-library";
import cookieParser from "cookie-parser";
// import * as Sentry from "@sentry/node";
import { functionErrorHandler } from "./handlers/FunctionalErrorHandler";
import { Server } from "socket.io";
import { createServer } from "http";
import { MessageCreator } from "./controllers/messages.controller";
dotnev.config();

const app: Express = express();

// Sentry.setupExpressErrorHandler(app);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
export const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);
// oAuth2Client.on("tokens", async (tokens) => {
//   if (tokens.refresh_token) {

//   }
// });

const port = process.env.PORT;

export const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 14776,
  },
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Event listener for Redis errors
redisClient.on("error", (err) => console.error("Redis Client Error", err));

//middlewares
app.use(express.json());

//routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (functionErrorHandler.isTrustedError(err)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
  functionErrorHandler.handleError(err);
  return res.status(500).json({ message: "Backend Error", errorMessage: err });
});

const server = app.listen(8080, () =>
  console.log(`[server]:Server is running at http://localhost:${port}`)
);
const io = new Server(server, {
  cors: {
    origin:
      // process.env["NODE_ENV"] === "developement"
      "http://localhost:3000",
    //       : config.APP_URL,
  },
});
const hashMap: Record<string, string> = {};
io.on("connection", (socket) => {
  // socket.on("join", (conversationId) => {
  //   if (!(conversationId in hashMap)) {
  //     console.log("Creating new conversation id", conversationId);
  //     hashMap[conversationId] = socket.id;
  //   } else {
  //     console.log("Already Exist", conversationId);
  //   }
  // });

  socket.on(
    "private_chat_message",
    async (data: {
      messageBody: string;
      conversationId: string;
      senderId: string;
      recipientId: string;
    }) => {
      // const recConversationId = hashMap[data.conversationId];

      // console.log(
      //   "recConversationId-=====<",
      //   recConversationId,
      //   "\n",
      //   "this is conservationId",
      //   data.conversationId
      // );
      console.log("chatData", data);
      const message = await MessageCreator(data);
      socket.broadcast.emit(data.conversationId, message);
      socket.broadcast.emit("private_chat_message");
      // io.to(data.conversationId).emit()
      // socket.to(recConversationId).emit("private_chat_message", message);
    }
  );
});
