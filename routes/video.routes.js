import { Router } from "express";
import verifyAuth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { addToPlaylist, getAllVideos, getVideoOfTheUser, getVideosByUser, uploadVideo } from "../controllers/videoController.js";
import { addComment, deleteComment, likeVideo, unlikeVideo } from "../controllers/likeAndCommentController.js";

const router = Router();

router.get("/getvideos", getAllVideos);
router.post("/upload", verifyAuth, upload.fields([{ name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), uploadVideo);
router.patch("/playlist/add/:videoId", verifyAuth, addToPlaylist);
router.post("/like/:videoId", verifyAuth, likeVideo);
router.delete("/unlike/:videoId", verifyAuth, unlikeVideo);
router.post("/comment/add/:videoId", verifyAuth, addComment);
router.delete("/comment/delete/:commentId", verifyAuth, deleteComment);
router.get("/getvideos/:userId", verifyAuth, getVideosByUser);
router.get("/getuservideo", verifyAuth, getVideoOfTheUser);


export default router;