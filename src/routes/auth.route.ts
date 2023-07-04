import { Router } from 'express'

import AuthController from '~/controllers/auth/auth.index.controller'
import * as middlewares from '~/middlewares/index.middleware'

const authRouter = Router()

// Email/password sign in
authRouter.post('/signin/email', AuthController.signInByEmail)

// Facebook sign in
authRouter.post('/signin/facebook', AuthController.signInByFacebook)

// Google sign in
authRouter.post('/signin/google', AuthController.loginByGoogle)

// Signup
authRouter.post('/signup/send-otp', middlewares.validateSendingOtpRequest, AuthController.sendOtpWhenSignUp)
authRouter.post('/signup/resend-otp', middlewares.validateSendingOtpRequest, AuthController.resendOtpWhenSignUp)
authRouter.post('/signup/verify-otp', AuthController.verifyOtpWhenSignUp)

// Sign out
authRouter.post('/signout', middlewares.validateAccessToken, AuthController.signOut)

// Refresh access token
authRouter.post('/refresh-access-token', AuthController.refreshAccessToken)

export default authRouter
