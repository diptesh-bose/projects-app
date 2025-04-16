import { Router } from 'express';
import { 
  login, 
  register, 
  logout, 
  refreshToken,
  getCurrentUser 
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', login as any);
router.post('/register', register as any);
router.post('/refresh-token', refreshToken as any);
router.post('/logout', logout as any);

// Protected routes
router.get('/me', authenticateToken as any, getCurrentUser as any);

export default router;