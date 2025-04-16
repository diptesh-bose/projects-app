import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Get all tasks for the authenticated user
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }

    const tasks = await prisma.task.findMany({
      where: {
        project: {
          userId: req.user.id
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};

// Get tasks for a specific project
export const getTasksByProject = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }

    const { projectId } = req.params;

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found', code: 'PROJECT_NOT_FOUND' });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Error getting tasks by project:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};

// Get a specific task by ID
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }

    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId: req.user.id
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found', code: 'TASK_NOT_FOUND' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Error getting task by ID:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};

// Create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }

    const { title, description, status, projectId } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required', code: 'MISSING_TITLE' });
    }

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required', code: 'MISSING_PROJECT_ID' });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found', code: 'PROJECT_NOT_FOUND' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: status || 'Todo',
        projectId
      }
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};

// Update an existing task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }

    const { id } = req.params;
    const { title, description, status, projectId } = req.body;

    // Check if task exists and belongs to the user's project
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId: req.user.id
        }
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found', code: 'TASK_NOT_FOUND' });
    }

    // If changing projects, verify the new project belongs to the user
    if (projectId && projectId !== existingTask.projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: req.user.id
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found', code: 'PROJECT_NOT_FOUND' });
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || existingTask.title,
        description: description !== undefined ? description : existingTask.description,
        status: status || existingTask.status,
        projectId: projectId || existingTask.projectId
      }
    });

    res.json({ task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};

// Delete a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }

    const { id } = req.params;

    // Check if task exists and belongs to the user's project
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId: req.user.id
        }
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found', code: 'TASK_NOT_FOUND' });
    }

    await prisma.task.delete({
      where: { id }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};