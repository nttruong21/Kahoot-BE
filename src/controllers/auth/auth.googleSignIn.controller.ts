import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import otpGenerator from 'otp-generator'
import { OAuth2Client } from 'google-auth-library'

import logging from '~/utils/logging.util'
import setTokenCookie from '~/utils/setTokenCookie.util'
import * as jwtServices from '~/services/jwt/jwt.index.service'

const googleSignInController = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   // Check validation errors
  //   const errors = validationResult(req)?.['errors']
  //   if (errors.length > 0) {
  //     return next(createError(400, errors[0].msg))
  //   }
  //   const { token, id }: { token: string; id: string } = req.body
  //   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  //   // Verify token
  //   const googlePayload = (
  //     await client.verifyIdToken({
  //       idToken: token,
  //       audience: process.env.GOOGLE_CLIENT_ID
  //     })
  //   ).getPayload()
  //   if (!googlePayload || googlePayload.sub !== id) {
  //     return next(createError(401))
  //   }
  //   // Check user is existed or not
  //   const user = await User.findOne({ ggid: id }).exec()
  //   let responseData
  //   if (user) {
  //     // Get profile
  //     const profile = await Profile.findById(user._id).exec()
  //     // Set response data
  //     responseData = {
  //       _id: user._id.toString(),
  //       name: profile?.name,
  //       username: profile?.username,
  //       avatar: profile?.avatar,
  //       bio: profile?.bio,
  //       website: profile?.website,
  //       gender: profile?.gender
  //     }
  //   } else {
  //     // Create random username
  //     const randomUsername =
  //       googlePayload.name?.toLocaleLowerCase().split(' ').join('-') + '-' + otpGenerator.generate()
  //     // Create new user with fbid: id, username: random username
  //     const createUserResponse = await User.create({
  //       ggid: id
  //     })
  //     // Create new profile
  //     await Profile.create({
  //       _id: createUserResponse._id.toString(),
  //       name: googlePayload.name,
  //       username: randomUsername
  //     })
  //     // Set response data
  //     responseData = {
  //       _id: createUserResponse._id.toString(),
  //       name: googlePayload.name,
  //       username: randomUsername,
  //       avatar: 'http://localhost:5000/images/default-avt.jpg',
  //       bio: null,
  //       website: null,
  //       gender: null
  //     }
  //   }
  //   // Sign access token & refresh token
  //   const payload: TokenPayload = {
  //     id: responseData._id
  //   }
  //   const accessToken = await jwtServices.signAccessTokenService(payload)
  //   const refreshToken = await jwtServices.signRefreshTokenService(payload)
  //   // Set cookie
  //   setTokenCookie(res, accessToken, refreshToken)
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: 'Sign in by google successfully',
  //     data: responseData
  //   })
  // } catch (error) {
  //   logging.error('Google sign in controller has error', error)
  //   return next(createError(500))
  // }
}

export default googleSignInController
