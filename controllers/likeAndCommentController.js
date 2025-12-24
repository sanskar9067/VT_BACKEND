import Like from '../models/likes.model.js';
import Comment from '../models/comments.model.js';

export const likeVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const existingLike = await Like.findOne({ user: req.user._id, video: videoId });
        if (existingLike) {
            return res.status(400).json({
                success: false,
                message: "Video already liked"
            });
        }

        const newLike = new Like({
            user: req.user._id,
            video: videoId
        });

        await newLike.save();

        return res.status(201).json({
            success: true,
            message: "Video liked successfully",
            like: newLike
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

export const unlikeVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const existingLike = await Like.findOne({ user: req.user._id, video: videoId });
        if (!existingLike) {
            return res.status(400).json({
                success: false,
                message: "Video not liked yet"
            });
        }

        await Like.deleteOne({ _id: existingLike._id });

        return res.status(200).json({
            success: true,
            message: "Video unliked successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

export const addComment = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { content } = req.body;

        const newComment = new Comment({
            user: req.user._id,
            video: videoId,
            content
        });

        await newComment.save();

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: newComment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const existingComment = await Comment.findOne({ _id: commentId, user: req.user._id });
        if (!existingComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        await Comment.deleteOne({ _id: commentId });

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}