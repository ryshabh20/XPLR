import express from "express";
import {
  checkConversationExists,
  CreateNewConversation,
  getAllConversations,
  CreateNewGroupConversations,
} from "../controllers/conversations.controller";
import { AuthCheck } from "../middlewares";
const router = express.Router();

router.post("/new", AuthCheck, CreateNewConversation);
router.post("/newgroup", AuthCheck, CreateNewGroupConversations);
router.post("/status", AuthCheck, checkConversationExists);
router.get("/", AuthCheck, getAllConversations);
export default router;
