import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import upload from '../middlewares/multer.middleware.js';
import verifyAuth from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', upload.fields(
    [{ name: 'avatar', maxCount: 1 }, 
        {name: 'coverImage', maxCount: 1 }]), 
    registerUser);

router.post('/login', loginUser);
router.get('/logout', verifyAuth, logoutUser);

export default router;