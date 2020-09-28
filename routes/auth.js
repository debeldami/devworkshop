const express = require('express');
const {
  register,
  login,
  getMe,
  forgetPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require('../controllers/auth');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.post('/forgetpassword', forgetPassword);
router.put('/updatepassword', protect, updatePassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;
