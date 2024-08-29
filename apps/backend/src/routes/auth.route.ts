import express from "express";
import {
  GoogleLogin,
  Login,
  logout,
  OtpGenerator,
  signup,
  VerifyOtp,
} from "../controllers/auth.controller";
import { RefreshToken } from "../../utils/tokens";

const router = express.Router();

router.post("/signup", signup);
router.post("/otp", OtpGenerator);
router.post("/google", GoogleLogin);
router.post("/verify", VerifyOtp);
router.post("/login", Login);
router.get("/logout", logout);
router.get("/refresh-token", RefreshToken);

export default router;
