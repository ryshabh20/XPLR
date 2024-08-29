import express from "express";
import { AuthCheck } from "../middlewares";
import { SendMessage } from "../controllers/messages.controller";
const router = express.Router();

router.post("/send", AuthCheck, SendMessage);

export default router;
