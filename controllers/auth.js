const User = require('../models/user');
const ErrorResponse = require('../utils/error');
const asyncHandler = require('../middlewares/async');

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

/**
 * @description Get current login user
 * @route POST api/v1/auth/me
 * @access Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
