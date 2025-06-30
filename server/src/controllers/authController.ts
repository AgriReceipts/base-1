import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt, {SignOptions} from 'jsonwebtoken';
import prisma from '../utils/database';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private (only to admin)
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {username, password, role, name, designation, committeeName} =
      req.body;

    // Validate required fields
    if (!username || !password || !role || !name || !designation) {
      return res.status(400).json({
        message:
          'All fields are required: username, password, role, name, designation',
      });
    }

    // Validate password strength (optional but recommended)
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {username},
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Username already exists',
      });
    }

    const committee = await prisma.committee.findUnique({
      where: {name: committeeName},
    });

    if (!committee) {
      return res.status(400).json({
        message: 'Invalid committee , Doesnot exist',
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash,
        name,
        role,
        designation,
        committeeId: committee.id || null,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        designation: true,
        committeeId: true,
        isActive: true,
        createdAt: true,
        committee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      {
        id: newUser.id,
        role: newUser.role,
        username: newUser.username,
        committee: newUser.committee,
      },
      jwtSecret,
      {expiresIn: '24h'}
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      message: 'Server error while creating new user',
    });
  }
};

// @desc    Logs in existing user
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

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Return user data (excluding password hash)
    const {passwordHash, ...userWithoutPassword} = user;

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

    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      message: 'Server error during login',
    });
  }
};
