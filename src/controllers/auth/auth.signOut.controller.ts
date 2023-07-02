import { NextFunction, Request, Response } from 'express'
import dayjs from 'dayjs'
import createError from 'http-errors'

import redisClient from '~/configs/redis.config'
import logging from '~/utils/logging.util'
import * as cookieServices from '~/services/cookie/cookie.index.service'
import * as jwtServices from '~/services/jwt/jwt.index.service'
import resetCookie from '~/utils/resetCookie.util'

const signOutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Remove refresh token on redis
    const encryptRefreshToken = req.cookies['refresh-token']
    const decryptRefreshToken = cookieServices.decrypt(encryptRefreshToken)

    if (!decryptRefreshToken) {
      return next(createError(400))
    }

    const { id: refreshTokenPayloadId } = await jwtServices.verifyRefreshTokenService(decryptRefreshToken)

    if (!refreshTokenPayloadId) {
      return next(createError(400))
    }

    redisClient.del(refreshTokenPayloadId.toString())

    // Reset cookie
    resetCookie(res)

    // Success response
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Sign out successfully'
    })
  } catch (error) {
    logging.error('Sign out controller has error', error)
    return next(createError(500))
  }
}

export default signOutController
