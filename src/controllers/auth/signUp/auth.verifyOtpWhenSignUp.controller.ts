import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import validator from 'validator'
import bcrypt from 'bcryptjs'

import logging from '~/utils/logging.util'
import { removeDots } from '~/utils/email.util'
import setTokenCookie from '~/utils/setTokenCookie.util'
import * as accountServices from '~/services/account/account.index.service'
import * as userServices from '~/services/user/user.index.service'
import * as jwtServices from '~/services/jwt/jwt.index.service'
import * as otpServices from '~/services/otp/otp.index.service'
import { TokenPayload } from '~/types/tokenPayload.type'

type RequestBody = {
  email: string
  password: string
  username: string
  otp: string
}

const verifyOtpWhenSignUpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email = '', password = '', username = '', otp = '' } = req.body as RequestBody

    // Validation
    // Email
    const finalEmail = removeDots(email.trim())
    if (
      !validator.isEmail(finalEmail, {
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

    // Otp
    if (validator.isEmpty(otp) || otp.length !== 6) {
      return next(createError(400, 'Invalid otp'))
    }

    // Check match otp
    const otpInDb = await otpServices.getLastOtp(email, otp)
    if (!otpInDb) {
      return next(createError(400, 'Otp is not match'))
    }
    if (new Date(otpInDb.expired).getTime() < new Date().getTime()) {
      return next(createError(400, 'Otp expired'))
    }

    // Create account
    const bcryptPassword = await bcrypt.hash(password, 12)
    const dateNow = new Date()
    const accountId = await accountServices.createAccount(email, bcryptPassword, dateNow)

    // Create user
    await userServices.createUser(accountId, username, '/images/default-avt.jpg', dateNow)

    // Sign access token & refresh token
    const payload: TokenPayload = {
      id: accountId
    }
    const accessToken = await jwtServices.signAccessTokenService(payload)
    const refreshToken = await jwtServices.signRefreshTokenService(payload)

    // Set cookie
    setTokenCookie(res, accessToken, refreshToken)
    // Success response
    return res.status(201).json({
      code: 201,
      success: true,
      message: 'Sign up successfully',
      data: {
        id: accountId,
        name: username,
        username,
        image: '/images/default-avt.jpg',
        created_at: dateNow.getTime(),
        access_token: accessToken,
        refresh_token: refreshToken
      }
    })
  } catch (error) {
    logging.error('Send otp when sign up controller has error', error)
    return next(createError(500))
  }
}
export default verifyOtpWhenSignUpController
