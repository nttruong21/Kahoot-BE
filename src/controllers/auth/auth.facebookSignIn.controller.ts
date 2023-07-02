import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import createError from 'http-errors'
import otpGenerator from 'otp-generator'

import logging from '~/utils/logging.util'
import setTokenCookie from '~/utils/setTokenCookie.util'
import * as jwtServices from '~/services/jwt/jwt.index.service'

const facebookSignInController = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  // Check validation errors
  //   const errors = validationResult(req)?.['errors']
  //   if (errors.length > 0) {
  //     return next(createError(400, errors[0].msg))
  //   }
  //   const { token, id }: { token: string; id: string } = req.body
  //   // Verify facebook token
  //   const { data: facebookAccountVerifiedData } = await axios.get(`https://graph.facebook.com/me?access_token=${token}`)
  //   if (!facebookAccountVerifiedData || facebookAccountVerifiedData.id !== id) {
  //     return next(createError(401))
  //   }
  //   // Get facebook user data
  //   const facebookUserData = (
  //     await axios.get(`https://graph.facebook.com/${id}?fields=email,name&access_token=${token}`)
  //   ).data
  //   // Check user is existed or not
  //   const user = await User.findOne({ fbid: id }).exec()
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
  //       facebookUserData.name.toLocaleLowerCase().split(' ').join('-') + '-' + otpGenerator.generate()
  //     // Create new user with fbid: id, username: random username
  //     const createUserResponse = await User.create({
  //       fbid: id
  //     })
  //     // Create new profile
  //     await Profile.create({
  //       _id: createUserResponse._id.toString(),
  //       name: facebookUserData.name,
  //       username: randomUsername
  //     })
  //     // Set response data
  //     responseData = {
  //       _id: createUserResponse._id.toString(),
  //       name: facebookUserData.name,
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
  //     message: 'Sign in by facebook successfully',
  //     data: responseData
  //   })
  // } catch (error) {
  //   logging.error('Facebook SignIn controller has error', error)
  //   return next(createError(500))
  // }
}

export default facebookSignInController
