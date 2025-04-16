import { Router } from 'express';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all project routes
router.use(authenticateToken as any);

// Get all user projects
router.get('/', getProjects as any);

// Get specific project by ID
router.get('/:id', getProjectById as any);

// Create new project
router.post('/', createProject as any);

// Update project
router.put('/:id', updateProject as any);

// Delete project
router.delete('/:id', deleteProject as any);

export default router;