import express from "express";
import {
  GoogleLogin,
  Login,
  OauthGoogle,
  OtpGenerator,
  signup,
  UserNameChecker,
  VerifyOtp,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/otp", OtpGenerator);
router.post("/google-login", GoogleLogin);
router.post("/verify-otp", VerifyOtp);
router.get("/check", UserNameChecker);
router.post("/login", Login);
router.get("/callback", OauthGoogle);

export default router;
