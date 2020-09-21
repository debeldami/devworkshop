const user = require('../models/user');
const ErrorResponse = require('../utils/error');
const asyncHandler = require('../middlewares/async');

/**
 * @description Register a user
 * @route Get api/v1/auth/register
 * @access Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
