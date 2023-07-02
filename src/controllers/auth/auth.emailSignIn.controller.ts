import { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import bcrypt from 'bcryptjs'
import validator from 'validator'

import logging from '~/utils/logging.util'
import setTokenCookie from '~/utils/setTokenCookie.util'

const emailSignInController = async (req: Request, res: Response, next: NextFunction) => {
  // Email, password, username
  const { email, password, username } = req.body

  // Validation
  // Email
  if (
    !validator.isEmail(email, {
      blacklisted_chars: ' '
    })
  ) {
    return next(createError(400, 'Invalid email'))
  }

  // Password
  if (
    !validator.isByteLength(password, {
      min: 6
    }) ||
    validator.contains(password, ' ')
  ) {
    return next(createError(400, 'Invalid password'))
  }

  // Username
  if (validator.isEmpty(username)) {
    return next(createError(400, 'Invalid username'))
  }

  // Checking in database
  // try {
  //   // Get user with email
  //   const user = await User.findOne({ email }).select('password')
  //   // Check user is existed
  //   if (!user) {
  //     return next(createError(400, 'Invalid email'))
  //   }
  //   // Compare password
  //   if (!(await bcrypt.compare(password, user.password))) {
  //     return next(createError(400, 'Invalid password'))
  //   }
  //   // Sign access token & refresh token
  //   const payload: TokenPayload = {
  //     id: user._id.toString()
  //   }
  //   const accessToken: string = await jwtServices.signAccessTokenService(payload)
  //   const refreshToken = await jwtServices.signRefreshTokenService(payload)
  //   // Set cookie
  //   setTokenCookie(res, accessToken, refreshToken)
  //   // Get profile
  //   const profile = await Profile.findById(user._id.toString()).select('-__v')
  //   // Success response
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: 'Sign in successfully',
  //     data: {
  //       _id: profile?._id.toString(),
  //       name: profile?.name,
  //       username: profile?.username,
  //       avatar: profile?.avatar,
  //       bio: profile?.bio,
  //       website: profile?.website,
  //       gender: profile?.gender
  //     }
  //   })
  // } catch (error) {
  //   logging.error('Email sign in controller has error', error)
  //   return next(createError(500))
  // }
}

export default emailSignInController
