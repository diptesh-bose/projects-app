import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UserCreateInput, LoginInput, AuthRequest } from '../types';

const prisma = new PrismaClient();

// Generate access token
const generateAccessToken = (user: { id: string, email: string, role?: string }) => {
  return jwt.sign(
    user,
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' } // 1 day expiration
  );
};

// Generate refresh token with longer expiration
const generateRefreshToken = (user: { id: string, email: string }) => {
  return jwt.sign(
    user,
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET as string,
    { expiresIn: '7d' } // 7 days expiration
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password }: UserCreateInput = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email', code: 'USER_EXISTS' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Generate tokens
    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: 'user' });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    // Set refresh token in HTTP-only cookie for added security
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict'
    });

    res.status(201).json({
      user,
      accessToken,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginInput = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ 
      id: user.id, 
      email: user.email, 
      role: 'user' // Hardcoded default role
    });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });
    res.json({
      user: {fresh token in HTTP-only cookie
        id: user.id,eshToken', refreshToken, {
        email: user.email,
        name: user.name,v.NODE_ENV === 'production',
        createdAt: user.createdAt,000, // 7 days
        updatedAt: user.updatedAt
      },
      accessToken,
      message: 'Login successful'
    });ser: {
  } catch (error) {,
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }     createdAt: user.createdAt,
};      updatedAt: user.updatedAt
      },
export const refreshToken = async (req: Request, res: Response) => {
  try {essage: 'Login successful'
    const refreshToken = req.cookies.refreshToken;
    catch (error) {
    if (!refreshToken) { error:', error);
      return res.status(401).json({ error: 'Refresh token not found', code: 'REFRESH_TOKEN_MISSING' });
    }
    
    try {
      // Verify refresh tokensync (req: Request, res: Response) => {
      const userData = jwt.verify(
        refreshToken,  = req.cookies.refreshToken;
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET as string
      ) as { id: string; email: string };
      return res.status(401).json({ error: 'Refresh token not found', code: 'REFRESH_TOKEN_MISSING' });
      // Check if user still exists
      const user = await prisma.user.findUnique({
        where: { id: userData.id }
      });Verify refresh token
      const userData = jwt.verify(
      if (!user) {en, 
        return res.status(401).json({ error: 'User not found', code: 'USER_NOT_FOUND' });
      } as { id: string; email: string };
      
      // Generate new access tokens
      const accessToken = generateAccessToken({ id: user.id, email: user.email, role: 'user' });
        where: { id: userData.id }
      res.json({
        accessToken,
        message: 'Token refreshed successfully'
      });eturn res.status(401).json({ error: 'User not found', code: 'USER_NOT_FOUND' });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid refresh token', code: 'INVALID_REFRESH_TOKEN' });
    } // Generate new access token
  } catch (error) {oken = generateAccessToken({ id: user.id, email: user.email, role: 'user' });
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }     accessToken,
};      message: 'Token refreshed successfully'
      });
export const logout = async (req: Request, res: Response) => {
  try {eturn res.status(401).json({ error: 'Invalid refresh token', code: 'INVALID_REFRESH_TOKEN' });
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {.json({ error: 'Server error', code: 'SERVER_ERROR' });
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};port const logout = async (req: Request, res: Response) => {
  try {
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {.clearCookie('refreshToken');
    if (!req.user || !req.user.id) {successfully' });
      return res.status(401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
    }onsole.error('Logout error:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,urrentUser = async (req: AuthRequest, res: Response) => {
        email: true,
        name: true,| !req.user.id) {
        createdAt: true,401).json({ error: 'User not authenticated', code: 'AUTH_REQUIRED' });
        updatedAt: true
      }
    });st user = await prisma.user.findUnique({
      where: { id: req.user.id },
    if (!user) {
      return res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' });
    }   email: true,
        name: true,
    const responseUser = {
      ...user,dAt: true
      role: req.user.role || 'user' // Default to 'user' if not specified
    };;
    
    res.json({ user: responseUser });
  } catch (error) {atus(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' });
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  } const responseUser = {
};    ...user,
      role: req.user.role || 'user' // Default to 'user' if not specified
    };
    
    res.json({ user: responseUser });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
};