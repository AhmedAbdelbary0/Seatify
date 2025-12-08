const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Public authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/refreshToken', authController.refreshAccessToken);
router.get('/logout', authController.logout);
router.get('/status', authController.getStatus);

module.exports = router;
