import emailSignInController from './signIn/auth.emailSignIn.controller'
import facebookSignInController from './signIn/auth.facebookSignIn.controller'
import googleSignInController from './signIn/auth.googleSignIn.controller'

import sendOtpWhenSignUpController from './signUp/auth.sendOtpWhenSignUp.controller'
import resendOtpWhenSignUpController from './signUp/auth.resendOtpWhenSignUp.controller'
import verifyOtpWhenSignUpController from './signUp/auth.verifyOtpWhenSignUp.controller'

import signOutController from './signOut/auth.signOut.controller'
import refreshAccessTokenController from './token/auth.refreshAccessToken.controller'

class AuthController {
  // Email/password login
  signInByEmail = emailSignInController

  // Facebook login
  signInByFacebook = facebookSignInController

  // Google login
  loginByGoogle = googleSignInController

  // Send otp when sign up
  sendOtpWhenSignUp = sendOtpWhenSignUpController

  // Resend otp when sign up
  resendOtpWhenSignUp = resendOtpWhenSignUpController

  // Verify otp when sign up
  verifyOtpWhenSignUp = verifyOtpWhenSignUpController

  // Logout
  signOut = signOutController

  // Refresh access token
  refreshAccessToken = refreshAccessTokenController
}

export default new AuthController()
