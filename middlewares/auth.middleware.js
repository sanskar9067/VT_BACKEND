import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

const verifyAuth = async (req, res, next) => {
    const accessToken = req.cookies.accessToken || req.headers['authorization']?.replace('Bearer ', '');
    if(!accessToken) {
        return res.status(401).json({
            success: false,
            message: "Access Token not found"
        });
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if(!decoded) {
        return res.status(401).json({
            success: false,
            message: "Invalid Access Token"
        });
    }
    //console.log("Decoded Token:", decoded);
    const user = await User.findById(decoded.userId);
    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    req.user = user;
    // For simplicity, we'll just call next() here
    next();
};

export default verifyAuth;