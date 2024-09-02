import express from "express";
import { AuthCheck } from "../middlewares";
import {
  getAllMessages,
  SendMessage,
} from "../controllers/messages.controller";
import { Auth } from "googleapis";
const router = express.Router();

router.post("/send", AuthCheck, SendMessage);
router.get("/", AuthCheck, getAllMessages);

export default router;
