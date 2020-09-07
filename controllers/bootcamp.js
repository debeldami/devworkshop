const Bootcamp = require('../models/Bootcamps');

/**
 * @description Get all bootcamps
 * @route Get api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamp.length, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false, data: null });
  }
};

/**
 * @description Get a single bootcamp
 * @route Get api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) throw Error();

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    // res.status(400).json({ success: false, data: null });
    next(error);
  }
};

/**
 * @description Create a bootcamp
 * @route POST api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    console.log(bootcamp);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false });
  }
};

/**
 * @description update a bootcamp
 * @route PUT api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!bootcamp) return res.status(400).json({ success: false });

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

/**
 * @description delete a bootcamp
 * @route PUT api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) return res.status(400).json({ success: false });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};
