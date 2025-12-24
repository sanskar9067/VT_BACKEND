import fs from 'fs';
import uploadToCloudinary from '../utils/cloudinarySetup.js';
import Video from '../models/video.models.js';
import Playlist from '../models/playlist.model.js';

export const uploadVideo = async (req, res) => {
    try {
        const {title, description} = req.body;
        const videoFile = req.files['videoFile'] ? req.files['videoFile'][0].path : null;
        const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;

        if (!title || !description || !videoFile || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "Title, description, video file and thumbnail are required"
            });
        }
        const videoUploadResult = await uploadToCloudinary(videoFile);
        const thumbnailUploadResult = await uploadToCloudinary(thumbnail);

        // Delete local files after upload
        fs.unlinkSync(videoFile);
        fs.unlinkSync(thumbnail);

        if (!videoUploadResult || !thumbnailUploadResult) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload files to Cloudinary"
            });
        }

        const savedVideo = new Video({
            videoFile: videoUploadResult.secure_url,
            thumbnail: thumbnailUploadResult.secure_url,
            owner: req.user._id,
            title,
            description,
            duration: videoUploadResult.duration
        });

        await savedVideo.save();

        return res.status(201).json({
            success: true,
            message: "Video uploaded successfully",
            video: savedVideo
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

export const addToPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body;
        const playlist = await Playlist.findOne({createdBy: req.user._id});
        if(!playlist) {
            if(!name) {
                return res.status(400).json({
                    success: false,
                    message: "Playlist name is required to create a new playlist"
                });
            }
            const newPlaylist = new Playlist({
                name,
                description,
                createdBy: req.user._id,
                videos: [req.params.videoId]
            });
            await newPlaylist.save();
            return res.status(201).json({
                success: true,
                message: "Playlist created successfully",
                playlist: newPlaylist
            });
        }else{
            playlist.videos.push(req.params.videoId);
            await playlist.save();
            return res.status(200).json({
                success: true,
                message: "Video added to playlist",
                playlist
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            videos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

export const getVideosByUser = async (req, res) => {
    try {
        const videos = await Video.find({ owner: req.params.userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            videos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

export const getVideoOfTheUser = async (req, res) => {
    try {
        const videos = await Video.find({ owner: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            videos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}