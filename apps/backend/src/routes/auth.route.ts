import express from "express";
import {
  OtpGenerator,
  signup,
  VerifyOtp,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/otp", OtpGenerator);
router.post("/verify-otp", VerifyOtp);

export default router;
