const Course = require('../models/Courses');
const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/error');
const asyncHandler = require('../middlewares/async');
const Courses = require('../models/Courses');

/**
 * @description Get courses or Get courses for specific bootcamp
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

/**
 * @description add a course
 * @route POST api/v1/bootcamps/:bootcampId/courses
 * @access Private
 */
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  console.log(bootcamp);

  if (!bootcamp) {
    return next(
      `Bootcamp with the id ${req.params.bootcampId} does not exist`,
      404
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @description update a course
 * @route PUT api/v1/courses/:id
 * @access Private
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(`no course with the id ${req.params.id}`, 404);
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @description delete a course
 * @route DELETE api/v1/courses/:id
 * @access Private
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(`no course with the id ${req.params.id}`, 404);
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
