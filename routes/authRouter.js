const express = require('express')
const authRouter = express()
const authController = require('../controllers/authController')
const authenticated = require('../middlware/authAuthentication')

authRouter.use(express.json())
authRouter.use(express.urlencoded({ extended: true }))

authRouter.set('view engine','ejs')
authRouter.set('views','./views/auth')

// Signup & Login 
authRouter.get('/signup',authController.signupGet)
authRouter.post('/signup',authController.signupPost)
authRouter.get('/login',authController.loginGet)
authRouter.post('/login',authController.loginPost)

// edit profile 
authRouter.get('/editProfile',authenticated,authController.editProfileGet)

// Forget Password 
authRouter.get('/recoverPassword',authController.recoverPasswordGet)
authRouter.post('/recoverPassword',authController.recoverPasswordPost)
authRouter.get('/otpVerification',authController.otpVerificationGet)
authRouter.post('/otpVerification',authController.otpVerificationPost)
authRouter.get('/newPassword',authController.newPasswordGet)
authRouter.post('/newPassword',authController.newPasswordPost)

module.exports = authRouter