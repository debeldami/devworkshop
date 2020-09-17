const express = require('express');
const { getCourses } = require('../controllers/courses');

const router = express.Router();

router.route('/', getCourses);

module.exports = router;
