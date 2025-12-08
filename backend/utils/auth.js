const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { AppError } = require("./errorHandler");
const asyncHandler = require("./asyncHandler");

// FIXED authenticate middleware
exports.authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check Authorization header first
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. If no header token, use cookie token
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new AppError("Unauthorized: missing token", 401);
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError("Unauthorized: invalid or expired token", 401);
  }

  const user = await User.findById(payload.id).select("-password");
  if (!user) throw new AppError("Unauthorized: user not found", 401);

  req.user = user;
  next();
});

// Role protection (unchanged)
exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return next(new AppError("Unauthorized", 401));
  if (req.user.role !== role)
    return next(new AppError("Forbidden: insufficient permissions", 403));
  next();
};