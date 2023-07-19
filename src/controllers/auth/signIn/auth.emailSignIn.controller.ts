import { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import bcrypt from 'bcryptjs'
import validator from 'validator'

import logging from '../../../utils/logging.util'
import * as accountServices from '../../../services/account/account.index.service'
import * as jwtServices from '../../../services/jwt/jwt.index.service'
import * as userServices from '../../../services/user/user.index.service'
import { TokenPayload } from '../../../types/tokenPayload.type'
import { removeDots } from '../../../utils/email.util'

type RequestBody = {
  email: string
  password: string
}

const emailSignInController = async (req: Request, res: Response, next: NextFunction) => {
  // Email, password
  const { email = '', password = '' } = req.body as RequestBody
  const finalEmail = removeDots(email)

  // Validation
  // Email
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

  // Checking in database
  try {
    // Get account by email
    const account = await accountServices.getAccount({ email: finalEmail })
    if (!account) {
      return next(createError(400, 'Email is not being registered'))
    }

    // Compare password
    if (!(await bcrypt.compare(password, account.password!))) {
      return next(createError(400, 'Password is not correct'))
    }

    // Sign access token & refresh token
    const payload: TokenPayload = {
      id: account.id
    }
    const accessToken: string = await jwtServices.signAccessTokenService(payload)
    const refreshToken = await jwtServices.signRefreshTokenService(payload)

    // Get user
    const user = await userServices.getUser({ id: account.id })
    if (!user) {
      return next(createError(500))
    }

    // Success response
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Sign in successfully',
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        created_at: user.created_at.getTime(),
        access_token: accessToken,
        refresh_token: refreshToken
      }
    })
  } catch (error) {
    logging.error('Email sign in controller has error', error)
    return next(createError(500))
  }
}

export default emailSignInController
