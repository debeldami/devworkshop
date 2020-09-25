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
  if (req.params.bootcampId) {
    const course = await Course.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: course.length,
      data: course,
    });
  } else {
    res.status(200).json(res.advancedResult);
  }
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
  //add user to req.body
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      `Bootcamp with the id ${req.params.bootcampId} does not exist`,
      404
    );
  }

  //make sure user is owner of bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user is not authorized to add course to this bootcamp`,
        401
      )
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

  //make sure user is owner of course
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`user is not authorized to update this course`, 401)
    );
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

  //make sure user is owner of course
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`user is not authorized to delete this course`, 401)
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
