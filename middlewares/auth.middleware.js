import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

const verifyAuth = async (req, res, next) => {
    try {
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
    } catch (error) {
        console.log(error.name);
        if (error.name === 'TokenExpiredError') {
            const refreshToken = req.cookies.refreshToken || req.headers['x-refresh-token'];
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "Refresh Token not found"
                });
            }
            try {
                const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                if (!decodedRefresh) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid Refresh Token"
                    });
                }
                const user = await User.findById(decodedRefresh.userId);
                if (!user || user.refreshToken !== refreshToken) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid Refresh Token"
                    });
                }
                // Issue new access token
                const newAccessToken = jwt.sign(
                    { userId: user._id, email: user.email, username: user.username, fullName: user.fullName },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: true
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true
                });
                req.user = user;
                next();
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Internal Server error"
                });
            }       
        }
    }
}

export default verifyAuth;