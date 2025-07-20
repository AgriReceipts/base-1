import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';
import {RegisterUserInput, RegisterUserSchema} from '../../types/auth';

// @desc    Register a new user (UNCHANGED)
// @route   POST /api/auth/register
// @access  Private (only to admin)
export const registerUser = async (req: Request, res: Response) => {
  try {
    // Validate with Zod
    const parsed = RegisterUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const data: RegisterUserInput = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {username: data.username},
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Username already exists',
      });
    }

    // Validate committee
    let committeeId: string | null = null;

    if (data.role !== 'ad') {
      if (!data.committeeName) {
        return res
          .status(400)
          .json({message: 'committeeName is required for non-AD users'});
      }

      const committee = await prisma.committee.findUnique({
        where: {name: data.committeeName},
      });

      if (!committee) {
        return res.status(400).json({
          message: 'Invalid committee, does not exist',
        });
      }

      committeeId = committee.id;
    }

    //  Create user (storing password in plaintext)
    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        password: data.password, // Store plaintext password
        name: data.name,
        role: data.role,
        designation: data.designation,
        committeeId: committeeId,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        role: true,
        committee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Respond
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.username,
      password: data.password,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};

// @desc    Logs in existing user (MODIFIED to use HttpOnly cookies)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const {username, password} = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {username},
      include: {
        committee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        message: 'Account is deactivated',
      });
    }

    // Verify password (direct comparison since no hashing)
    if (password !== user.password) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Return user data (excluding password)
    const {password: userPassword, ...userWithoutPassword} = user;

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
        committee: user.committee,
      },
      jwtSecret,
      {expiresIn: '24h'}
    );

    // CHANGE 1: Set HttpOnly cookie instead of returning token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // CHANGE 2: Don't return token in response, return user data
    res.status(200).json({
      message: 'Login successful',
      user: {
        name: userWithoutPassword.name,
        designation: userWithoutPassword.designation,
      },
      role: userWithoutPassword.role,
      committee: userWithoutPassword.committee,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};

// ADD: New endpoint to check auth status
// @desc    Check if user is authenticated
// @route   GET /api/auth/me
// @access  Private (requires cookie)
export const checkAuth = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({message: 'Not authenticated'});
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: {id: decoded.id},
      include: {
        committee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({message: 'User not found or inactive'});
    }

    res.json({
      user: {
        name: user.name,
        designation: user.designation,
      },
      role: user.role,
      committee: user.committee,
    });
  } catch (error) {
    return res.status(401).json({message: 'Invalid token'});
  }
};

// ADD: New endpoint to logout
// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.json({message: 'Logged out successfully'});
};

// @desc    Get all users with their details
// @route   GET /api/auth/users
// @access  Private (only to admin)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        password: true, // Include plaintext password
        role: true,
        name: true,
        designation: true,
        committee: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        username: 'asc',
      },
    });

    // Format the response to match requested structure
    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      committeeName: user.committee?.name || null,
      password: user.password,
      role: user.role,
      name: user.name,
      designation: user.designation,
    }));

    res.status(200).json({
      message: 'Users retrieved successfully',
      users: formattedUsers,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};

// @desc    SoftDelete(set status to inactive)
// @route   /auth/delete/:id
// @access  Private (only to admin)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(401).json({
        message: 'User id is required',
      });
    }
    const userId = id as string;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive: false,
      },
    });
    return res.status(200).json({
      message: 'User deleted successfully  ',
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
