import express from 'express';
import { authUser, registerUser, getUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

export default router;
