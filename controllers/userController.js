import User from '../models/user.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uploadToCloudinary from '../utils/cloudinarySetup.js';
import fs from 'fs';

export const registerUser = async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;
        if (!username || !fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        if(!req.files || !req.files['avatar']) {
            return res.status(400).json({ success: false, message: "Avatar and Cover Image are required" });
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

        const coverImageUpload = await uploadToCloudinary(req.files['coverImage'][0].path)
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
        });

        await newUser.save();
        fs.unlinkSync(req.files['avatar'][0].path);
        fs.unlinkSync(req.files['coverImage'][0].path);
        res.status(200).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const accessToken = jwt.sign(
            {userId: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        const refreshToken = jwt.sign(
            {userId: user._id, email: user.email},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: '7d'}
        );

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200)
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        })
        .cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true
        })
        .json({
            success: true,
            message: "Login Successful",
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}

export const logoutUser = async(req, res) => {
    try {
        console.log(req.cookies);
        const accessToken = req.cookies.accessToken;
        if(!accessToken) {
            return res.status(400).json({
                success: false,
                message: "Access Token not found"
            });
        }

        const user = await User.findOne({accessToken});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.refreshToken = null;
        await user.save();

        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');

        return res.status(200).json({
            success: true,
            message: "Logout Successful"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}