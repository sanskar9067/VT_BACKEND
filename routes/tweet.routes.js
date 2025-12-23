import { Router } from "express";
import verifyAuth from "../middlewares/auth.middleware.js";
import { createTweet } from "../controllers/tweetController.js";

const router = Router();

router.post("/addtweet", verifyAuth, createTweet);
export default router;