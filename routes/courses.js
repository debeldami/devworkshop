const express = require('express');
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

const Courses = require('../models/Courses');
const advancedResult = require('../middlewares/advancedResult');

const router = express.Router({ mergeParams: true });

//importing the procted middleware
const { protect, authorize } = require('../middlewares/auth');

router
  .route('/')
  .get(
    advancedResult(Courses, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, authorize('admin', 'publisher'), addCourse);
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin', 'publisher'), updateCourse)
  .delete(protect, authorize('admin', 'publisher'), deleteCourse);

module.exports = router;
