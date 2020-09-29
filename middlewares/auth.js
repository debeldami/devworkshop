const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/error');
const User = require('../models/users');

//protect route
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  //make sure token exist
  if (!token) {
    return next(new ErrorResponse('not authorized to access this route', 401));
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse('not authorized to access this route', 401));
  }
});

//Grant access to specific roles
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `${req.user.role} role not authorized to access this route`,
        403
      )
    );
  }
  next();
};
