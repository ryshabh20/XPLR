import express, { Express } from "express";
import authRouter from "./routes/auth.route";
import dotnev from "dotenv";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const prisma = new PrismaClient();

dotnev.config();

const app: Express = express();
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
app.use(cors());

//routes
app.use("/api/user", authRouter);

app.listen(8080, () =>
  console.log(`[server]:Server is running at http://localhost:${port}`)
);
