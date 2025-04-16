import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Get all projects for the authenticated user
export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }

    const projects = await prisma.project.findMany({
      where: {
        ownerId: req.user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json({ projects });
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};

// Get a specific project by ID
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }

    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.user.id // Ensure user can only access their own projects
      },
      include: {
        tasks: true // Include related tasks if you have them
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found', code: 'PROJECT_NOT_FOUND' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Error getting project by ID:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};

// Create a new project
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required', code: 'MISSING_NAME' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || '',
        ownerId: req.user.id,
        startDate: new Date(), // Required by schema
        status: 'active'
      }
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};

// Update an existing project
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }

    const { id } = req.params;
    const { name, description, status } = req.body;

    // Check if project exists and belongs to the user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.user.id
      }
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found', code: 'PROJECT_NOT_FOUND' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: name || existingProject.name,
        description: description !== undefined ? description : existingProject.description,
        status: status || existingProject.status
      }
    });

    res.json({ project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};

// Delete a project
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }

    const { id } = req.params;

    // Check if project exists and belongs to the user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.user.id
      }
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found', code: 'PROJECT_NOT_FOUND' });
    }

    await prisma.project.delete({
      where: { id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};