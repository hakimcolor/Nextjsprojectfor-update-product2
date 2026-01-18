const express = require('express');
const router = express.Router();
const {
  getUserByEmail,
  addUser,
  validatePassword,
  getAllUsers,
  getUsersCount,
} = require('../data/users');
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const { validateUser, validateLogin } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/auth/register - Register new user
router.post(
  '/register',
  validateUser,
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user
    const newUser = addUser({ name, email, password, role });

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        message: 'Registration successful',
      },
      message: 'User registered successfully',
    });
  })
);

// POST /api/auth/login - Login user
router.post(
  '/login',
  validateLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Validate password
    const isValidPassword = validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        message: 'Login successful',
      },
      message: 'Login successful',
    });
  })
);

// GET /api/auth/me - Get current user profile
router.get(
  '/me',
  authenticateUser,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: req.user,
      message: 'User profile retrieved successfully',
    });
  })
);

// GET /api/auth/users - Get all users (admin only)
router.get(
  '/users',
  authenticateUser,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const users = getAllUsers();

    res.json({
      success: true,
      data: users,
      total: getUsersCount(),
      message: 'Users retrieved successfully',
    });
  })
);

module.exports = router;
