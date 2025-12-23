import Tweet from "../models/tweet.model.js";

export const createTweet = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        const newTweet = new Tweet({
            content,
            owner: req.user._id
        });

        await newTweet.save();

        return res.status(201).json({
            success: true,
            message: "Tweet created successfully",
            tweet: newTweet
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
};