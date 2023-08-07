import { Router } from 'express'

import AuthController from '../controllers/auth/auth.index.controller'
import * as middlewares from '../middlewares/index.middleware'

const authRouter = Router()

// Email/password sign in
authRouter.post('/sign-in/email', AuthController.signInByEmail)

// Facebook sign in
authRouter.post('/sign-in/facebook', AuthController.signInByFacebook)

// Google sign in
authRouter.post('/sign-in/google', AuthController.signInByGoogle)

// Signup
authRouter.post('/sign-up', AuthController.signUp)

// Sign out
authRouter.post('/sign-out', AuthController.signOut)

// Send OTP
authRouter.post('/send-otp', middlewares.validateSendingOtpRequest, AuthController.sendOtp)

// Refresh access token
authRouter.post('/refresh-access-token', AuthController.refreshAccessToken)

// Reset password
authRouter.post('/reset-password', AuthController.resetPassword)

export default authRouter
