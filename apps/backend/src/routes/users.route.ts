import express from "express";
import { AuthCheck } from "../middlewares";
import {
  getAllUsers,
  GetUser,
  UserNameChecker,
} from "../controllers/users.controller";
const router = express.Router();
router.get("/me", AuthCheck, GetUser);
router.get("/status", UserNameChecker);
router.post("/", AuthCheck, getAllUsers);
export default router;
