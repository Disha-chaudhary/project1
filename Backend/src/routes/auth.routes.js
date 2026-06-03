const express = require('express');

const authRouter = express.Router();
const authController = require('../controllers/auth.contoller');
const authMiddleware = require('../middlewares/auth.middleware');


authRouter.post('/register', authController.registerUser);
/**
 * * @route POST /api/auth/login
 * * @desc Login a user
 * * @access Public
 */

authRouter.post('/login', authController.loginUser);


/**
 * @route GET/api/auth/logout
 * @description clear token from user cookie and add token inthe blacklist
 * @access public
 */

authRouter.get('/logout',authController.logoutUSerController)

/**
 * @route GET/api/auth/get-me
 * @description get user details * @access private
 */
authRouter.get(
  "/get-me",
  authMiddleware.authUser,
  authController.getMeController
);
module.exports = authRouter;