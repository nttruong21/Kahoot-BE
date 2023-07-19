import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import otpGenerator from 'otp-generator'
import { OAuth2Client } from 'google-auth-library'
import validator from 'validator'

import logging from '../../../utils/logging.util'
import * as jwtServices from '../../../services/jwt/jwt.index.service'
import * as accountServices from '../../../services/account/account.index.service'
import * as userServices from '../../../services/user/user.index.service'
import { TokenPayload } from '../../../types/tokenPayload.type'
import { AccountType } from '../../../enums/account.enum'

type RequestBody = {
  googleId: string
  googleToken: string
}

const googleSignInController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get id, token of google auth
    const { googleId, googleToken } = req.body as RequestBody

    // Validation
    if (validator.isEmpty(googleId)) {
      return next(createError(400, 'Invalid google id'))
    }
    if (validator.isEmpty(googleToken)) {
      return next(createError(400, 'Invalid google token'))
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID

    const client = new OAuth2Client(googleClientId)

    // Verify token
    const googlePayload = (
      await client.verifyIdToken({
        idToken: googleToken,
        audience: googleClientId
      })
    ).getPayload()

    if (!googlePayload || googlePayload.sub !== googleId) {
      return next(createError(401))
    }

    // Check account is existed or not
    // Get account
    const account = await accountServices.getAccount({ ggid: googleId })
    let responseData
    let userId: number | null
    if (account) {
      userId = account.id

      // Get profile
      const user = await userServices.getUser({ id: account.id })
      if (!user) {
        return next(createError(500))
      }

      // Set response data
      responseData = {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        created_at: user.created_at.getTime()
      }
    } else {
      // Create random username
      const randomUsername =
        googlePayload.name?.toLocaleLowerCase().split(' ').join('-') + '-' + otpGenerator.generate(6)

      // Create account
      const dateNow = new Date()
      userId = await accountServices.createAccount(AccountType.google, {
        ggid: googleId,
        date: dateNow
      })

      if (!userId) {
        return next(createError(500))
      }

      // Create user
      await userServices.createUser(userId, randomUsername, '/images/default-avt.jpg', dateNow)

      // Set response data
      responseData = {
        id: userId,
        name: randomUsername,
        username: randomUsername,
        image: '/images/default-avt.jpg',
        created_at: dateNow.getTime()
      }
    }

    // Sign access token & refresh token
    const payload: TokenPayload = {
      id: userId
    }
    const accessToken = await jwtServices.signAccessTokenService(payload)
    const refreshToken = await jwtServices.signRefreshTokenService(payload)

    // Success response
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Sign in by google successfully',
      data: {
        ...responseData,
        access_token: accessToken,
        refresh_token: refreshToken
      }
    })
  } catch (error) {
    logging.error('Google sign in controller has error', error)
    return next(createError(500))
  }
}

export default googleSignInController
