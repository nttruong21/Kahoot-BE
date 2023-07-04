import { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import validator from 'validator'

import redisClient from '~/configs/redis.config'
import logging from '~/utils/logging.util'
import * as jwtServices from '~/services/jwt/jwt.index.service'

type RequestBody = {
  refreshToken: string
}

const signOutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get refresh token
    const { refreshToken = '' } = req.body as RequestBody
    if (validator.isEmpty(refreshToken) || validator.contains(refreshToken, ' ')) {
      return next(createError(400, 'Invalid refresh token'))
    }

    const { id: refreshTokenPayloadId } = await jwtServices.verifyRefreshTokenService(refreshToken)

    if (!refreshTokenPayloadId) {
      return next(createError(400))
    }

    // Remove on redis
    redisClient.del(refreshTokenPayloadId.toString())

    // Success response
    return res.status(200).json({
      code: 200,
      success: true,
      data: {},
      message: 'Sign out successfully'
    })
  } catch (error: any) {
    logging.error('Sign out controller has error', error)
    return next(createError(500, error.toString()))
  }
}

export default signOutController
