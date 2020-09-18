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
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

/**
 * @description Get a single course
 * @route Get api/v1/courses/:id
 * @access Public
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(`no course with the id ${req.params.id}`, 404);
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});
