import { Router } from 'express';
import { 
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject
} from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all task routes
router.use(authenticateToken as any);

// Get all tasks for user
router.get('/', getTasks as any);

// Get tasks by project
router.get('/project/:projectId', getTasksByProject as any);

// Get specific task
router.get('/:id', getTaskById as any);

// Create task
router.post('/', createTask as any);

// Update task
router.put('/:id', updateTask as any);

// Delete task
router.delete('/:id', deleteTask as any);

export default router;