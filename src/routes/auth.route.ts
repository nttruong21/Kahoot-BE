import { Router } from 'express'

import AuthController from '~/controllers/auth/auth.index.controller'
import * as middlewares from '~/middlewares/index.middleware'

// Temp
import * as accountServices from '~/services/account/account.index.service'

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
authRouter.post('/sign-out', middlewares.validateAccessToken, AuthController.signOut)

// Send OTP
authRouter.post('/send-otp', middlewares.validateSendingOtpRequest, AuthController.sendOtp)

// Refresh access token
authRouter.post('/refresh-access-token', AuthController.refreshAccessToken)

// Reset password
authRouter.post('/reset-password', AuthController.resetPassword)

// Temp
authRouter.delete('/temp/delete', async (req, res, next) => {
  const { id }: { id: number } = req.body
  await accountServices.deleteAccount(id)
  return res.status(200).json('Successfully')
})

export default authRouter
