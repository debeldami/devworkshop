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

router
  .route('/')
  .get(
    advancedResult(Courses, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
