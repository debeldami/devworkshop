const User = require('../models/user');
const ErrorResponse = require('../utils/error');
const asyncHandler = require('../middlewares/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

/**
 * @description Register a user
 * @route POST api/v1/auth/register
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

  sendTokenResponse(user, 200, res);
});

/**
 * @description Login a user
 * @route POST api/v1/auth/login
 * @access Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const validateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  console.log(validateEmail.test(email));

  //validate email and password
  if (!email || !password || !validateEmail.test(email)) {
    return next(
      new ErrorResponse('please provide a valid email and password', 404)
    );
  }

  //check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('invalid credentials', 401));
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @description Get current login user
 * @route POST api/v1/auth/me
 * @access Public
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @description Update user details
 * @route PUT api/v1/auth/updatedetails
 * @access Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  let fieldsToUpdate = {};

  if (req.body.name) {
    fieldsToUpdate.name = req.body.name;
  }
  if (req.body.email) {
    fieldsToUpdate.email = req.body.email;
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @description Update user password
 * @route PUT api/v1/auth/updatepassword
 * @access Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  console.log('1');

  const isPasswordMatched = await user.matchPassword(req.body.currentPassword);

  console.log(isPasswordMatched);

  if (!isPasswordMatched) {
    return next(new ErrorResponse('password is incorrect', 401));
  }

  console.log('2');

  user.password = req.body.newPassword;

  console.log('3');
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @description Forget password
 * @route POST api/v1/auth/forgetpassword
 * @access Public
 */
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  //check if email exist
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('user with the email does not exist', 404));
  }

  //get reset token
  const resetToken = user.getResetPasswordToken();

  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

/**
 * @description Reset password
 * @route PUT api/v1/auth/forgetpassword/:resettoken
 * @access Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetToken = req.params.resetToken;

  //get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExp: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('invalid token', 404));
  }

  if (req.body.password === undefined || req.body.password.length < 4) {
    return next(new ErrorResponse('password must exceed 5 characters', 404));
  }

  //set new password, password will still be encrypted due to pre save moongoose middle ware in User model
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

//get token, create cookies and send response
const sendTokenResponse = (user, stausCode, res) => {
  //create token from static method created in user model
  const token = user.getSignedJwtToken();

  //expires for expire date
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(stausCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
