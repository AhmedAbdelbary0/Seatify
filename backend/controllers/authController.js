const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../utils/errorHandler');
const crypto = require('crypto');
// HELPER FUNCTIONS

// Generate Access Token
const signAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '60m',
  });
};

// Generate Refresh Token
const signRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

// Send tokens in cookies + response
const sendTokens = (user, res, message) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  // Configure cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  // Set cookies
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000, // 60 minutes
  });
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  user.password = undefined;

  res.status(200).json({
    status: "success",
    message,
    accessToken,
    refreshToken,
    data: {
      user,
    },
  });
};

// REGISTER
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  // collect field-specific errors
  const fieldErrors = {};

  if (!firstName || !firstName.trim()) {
    fieldErrors.firstName = 'First name is required.';
  }
  if (!lastName || !lastName.trim()) {
    fieldErrors.lastName = 'Last name is required.';
  }
  if (!email || !email.trim()) {
    fieldErrors.email = 'Email is required.';
  }
  if (!password) {
    fieldErrors.password = 'Password is required.';
  } else if (password.length < 8) {
    fieldErrors.password = 'Password must be at least 8 characters.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    // 422 Unprocessable Entity with field-level errors
    return res.status(422).json({
      status: 'fail',
      message: 'Validation error.',
      errors: fieldErrors,
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      status: 'fail',
      message: 'Email already registered.',
      errors: { email: 'Email already registered.' },
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  sendTokens(user, res, 'User registered successfully');
});

// LOGIN
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new AppError('Please provide email and password.', 400);

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password)))
    throw new AppError('Invalid email or password.', 401);

  sendTokens(user, res, 'Login successful');
});

// LOGOUT
exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  });
});

// FORGOT PASSWORD
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new AppError('No user found with that email.', 404);

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${resetToken}`;

  res.status(200).json({
    status: 'success',
    message: 'Password reset link generated.',
    resetURL,
  });
});
// RESET PASSWORD
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError('Token invalid or expired.', 400);

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokens(user, res, 'Password reset successful');
});
// REFERESH ACCESS TOKEN
exports.refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError('No refresh token found. Please log in again.', 401);
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new AppError(
      'Invalid or expired refresh token. Please log in again.',
      401
    );
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User no longer exists.', 404);
  }

  const newAccessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '60m' }
  );

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, 
  });

  res.status(200).json({
    status: 'success',
    message: 'Access token refreshed successfully',
  });
});

exports.getStatus = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(200).json({
      status: 'success',
      authenticated: false
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(200).json({
      status: 'success',
      authenticated: false
    });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(200).json({
      status: 'success',
      authenticated: false
    });
  }

  const firstName = user.firstName || '';
  const lastName = user.lastName || '';

  res.status(200).json({
    status: 'success',
    authenticated: true,
    user: {
      id: user._id.toString(),  
      firstName,
      lastName,                 
      email: user.email,
      fullName: [firstName, lastName].filter(Boolean).join(' '), 
    }
  });
});
