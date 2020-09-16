const Course = require('../models/Courses');
const ErrorResponse = require('../utils/error');
const asyncHandler = require('../middlewares/async');

/**
 * @description Get courses
 * @route Get api/v1/courses
 * @route Get api/v1/bootcamps/:bootcampId/courses
 * @access Public
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
