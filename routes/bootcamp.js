const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamp');

const Bootcamp = require('../models/Bootcamps');
const advancedResult = require('../middlewares/advancedResult');

//include course resource routers
const courseRouter = require('./courses');

//include review resource routers
const reviewRouter = require('./reviews');

const router = express.Router();

//importing the proct & authorize middleware
const { protect, authorize } = require('../middlewares/auth');

//Re-route into other course router
router.use('/:bootcampId/courses', courseRouter);

//Re-route into other review router
router.use('/:bootcampId/reviews', reviewRouter);

router
  .route('/')
  .get(
    advancedResult(Bootcamp, {
      path: 'courses',
      select: 'title description',
    }),
    getBootcamps
  )
  .post(protect, authorize('admin', 'publisher'), createBootcamp);

router
  .route('/:id/photo')
  .put(protect, authorize('admin', 'publisher'), bootcampPhotoUpload);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('admin', 'publisher'), updateBootcamp)
  .delete(protect, authorize('admin', 'publisher'), deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

module.exports = router;
