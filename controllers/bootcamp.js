const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/error');
const geocoder = require('../utils/geocoder');
const omit = require('lodash/omit');
const asyncHandler = require('../middlewares/async');

/**
 * @description Get all bootcamps
 * @route Get api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  //excluding 'select' from query object using omit function from lodash
  const reqQuery = omit(req.query, ['select', 'sort', 'page', 'limit']);

  //create query string
  let queryString = JSON.stringify(reqQuery);

  //create operators e.g $in $gt $lt $gte $lte
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/,
    (match) => `$${match}`
  );

  //finding resourses
  let query = Bootcamp.find(JSON.parse(queryString));
  const total = (await query).length;

  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  query.skip(startIndex).limit(limit);

  const bootcamp = await query;

  //pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0 && total > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamp.length,
    pagination,
    data: bootcamp,
  });
});

/**
 * @description Get a single bootcamp
 * @route Get api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with the id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @description Create a bootcamp
 * @route POST api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

/**
 * @description update a bootcamp
 * @route PUT api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with the id ${req.params.id} not found`, 404)
    );
  }

  if (!bootcamp) return res.status(400).json({ success: false });

  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @description delete a bootcamp
 * @route DELETE api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with the id ${req.params.id} not found`, 404)
    );
  }

  if (!bootcamp) return res.status(400).json({ success: false });
  res.status(200).json({ success: true, data: {} });
});

/**
 * @description Get bootcamps within certain radius
 * @route GET api/v1/bootcamps/radius/:zipcode/:distance
 * @access Public
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //get longitude and latitude from the geocoder
  const loc = await geocoder.geocode(zipcode);
  const lng = loc[0].longitude;
  const lat = loc[0].latitude;

  //get radius using radian
  //divide distance by radius of earth
  //earth radius 6,378 km or 3,963 mi

  const radius = distance / 3963;

  const bootcamp = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});
