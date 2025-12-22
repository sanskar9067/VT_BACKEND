import { Router } from "express";
import verifyAuth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { uploadVideo } from "../controllers/videoController.js";

const router = Router();

router.post("/upload", verifyAuth, upload.fields([{ name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), uploadVideo);

export default router;