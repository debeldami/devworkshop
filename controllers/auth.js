const User = require('../models/user');
const ErrorResponse = require('../utils/error');
const asyncHandler = require('../middlewares/async');

/**
 * @description Register a user
 * @route Get api/v1/auth/register
 * @access Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  res.status(200).json({ success: user });
});
