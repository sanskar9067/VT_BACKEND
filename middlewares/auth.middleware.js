import jwt from 'jsonwebtoken';

const verifyAuth = (req, res, next) => {
    const accessToken = req.cookies.accessToken || req.headers['authorization']?.replace('Bearer ', '');
    if(!accessToken) {
        return res.status(401).json({
            success: false,
            message: "Access Token not found"
        });
    }
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if(!decoded) {
        return res.status(401).json({
            success: false,
            message: "Invalid Access Token"
        });
    }
    console.log("Decoded Token:", decoded);
    // For simplicity, we'll just call next() here
    next();
};

export default verifyAuth;