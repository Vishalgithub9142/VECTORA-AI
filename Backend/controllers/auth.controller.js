const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');
const asyncHandler = require('../utils/asyncHandler');
const { setAuthCookie } = require('../utils/cookieHelper');
const logger = require('../logger');
const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Helper to generate JWT
function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Register User
const registerUserController = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    logger.warn(`Registration validation failed: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
  const { username, email, password } = value;

  const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(400).json({ message: 'Account with same username or email already exists' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({ username, email, password: hash });
  const token = generateToken(user);
  setAuthCookie(res, token);

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: user._id, username: user.username, email: user.email }
  });
});

// Login User
const loginController = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    logger.warn(`Login validation failed: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
  const { email, password } = value;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const token = generateToken(user);
  setAuthCookie(res, token);

  res.status(200).json({
    message: 'User logged in successfully',
    user: { id: user._id, username: user.username, email: user.email }
  });
});

// Logout User
const logoutController = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: 'No token found' });
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await tokenBlacklistModel.create({ token });
  // Clear cookie using helper (maxAge 0 to delete)
  setAuthCookie(res, '', { maxAge: 0 });

  res.status(200).json({ message: 'User logged out successfully' });
});

// Get current user info
const getMeController = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({
    message: 'User found successfully',
    user: { id: user._id, username: user.username, email: user.email }
  });
});

module.exports = {
  registerUserController,
  loginController,
  logoutController,
  getMeController
};