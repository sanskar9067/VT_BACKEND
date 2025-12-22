import User from '../models/user.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uploadToCloudinary from '../utils/cloudinarySetup.js';
import fs from 'fs';

export const registerUser = async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;
        if (!username || !fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const avatarUpload = await uploadToCloudinary(req.files['avatar'][0].path)
        .then((result) => {
            console.log(result.url);
            return result;
        })
        .catch((error) => {
            console.error("Error uploading avatar to Cloudinary:", error);
            return
        });

        const coverImageUpload = uploadToCloudinary(req.files['coverImage'][0].path)
        .then((result) => {
            console.log(result.url);
            return result;
        })
        .catch((error) => {
            console.error("Error uploading cover image to Cloudinary:", error);
            return
        });
                
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword,
            avatar: avatarUpload ? avatarUpload.url : null,
            coverImage: coverImageUpload ? coverImageUpload.url : null,
            refreshToken: ''
        });

        await newUser.save();
        fs.unlinkSync(req.files['avatar'][0].path);
        fs.unlinkSync(req.files['coverImage'][0].path);
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}