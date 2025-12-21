import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    coverImage: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    refreshToken: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;