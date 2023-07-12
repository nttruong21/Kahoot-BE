import emailSignInController from './signIn/auth.emailSignIn.controller'
import facebookSignInController from './signIn/auth.facebookSignIn.controller'
import googleSignInController from './signIn/auth.googleSignIn.controller'

import signUpController from './signUp/auth.signUp.controller'

import signOutController from './signOut/auth.signOut.controller'

import sendOtpController from './site/auth.sendOtp.controller'
import refreshAccessTokenController from './site/auth.refreshAccessToken.controller'
import resetPasswordController from './site/auth.resetPassword.controller'

class AuthController {
  // Email/password sign in
  signInByEmail = emailSignInController

  // Facebook sign in
  signInByFacebook = facebookSignInController

  // Google sign in
  signInByGoogle = googleSignInController

  // Sign up
  signUp = signUpController

  // Sign out
  signOut = signOutController

  // Send otp
  sendOtp = sendOtpController

  // Refresh access token
  refreshAccessToken = refreshAccessTokenController

  // Reset password
  resetPassword = resetPasswordController
}

export default new AuthController()
