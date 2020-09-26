const express = require('express');
const {
  register,
  login,
  getMe,
  forgetPassword,
} = require('../controllers/auth');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgetpassord', forgetPassword);

module.exports = router;
