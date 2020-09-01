/**
 * @description Get all bootcamps
 * @route Get api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ data: 'send all bootcamps' });
};

/**
 * @description Get a single bootcamp
 * @route Get api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ data: 'send a bootcamp' });
};

/**
 * @description Create a bootcamp
 * @route POST api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ data: 'post bootcamp' });
};

/**
 * @description update a bootcamp
 * @route PUT api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ data: 'update bootcamp' });
};

/**
 * @description delete a bootcamp
 * @route PUT api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ data: 'delete bootcamp' });
};
