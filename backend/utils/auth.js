const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { AppError } = require('./errorHandler');
const asyncHandler = require('./asyncHandler');

// Verify JWT & attach user to req
exports.authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized: missing token', 401);
  }

  const token = authHeader.split(' ')[1];
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError('Unauthorized: invalid or expired token', 401);
  }

  const user = await User.findById(payload.id).select('-password');
  if (!user) throw new AppError('Unauthorized: user not found', 401);

  req.user = user;
  next();
});

exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return next(new AppError('Unauthorized', 401));
  if (req.user.role !== role)
    return next(new AppError('Forbidden: insufficient permissions', 403));
  next();
};
