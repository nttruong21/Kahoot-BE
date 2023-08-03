import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import validator from 'validator'

import logging from '../../../utils/logging.util'
import * as jwtServices from '../../../services/jwt/jwt.index.service'

type RequestBody = {
  refreshToken: string
}

const refreshAccessTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken = '' } = req.body as RequestBody
    if (validator.isEmpty(refreshToken) || validator.contains(refreshToken, ' ')) {
      return next(createError(400, 'Invalid refresh token'))
    }

    // Verify refresh token
    const verifyResponse = await jwtServices.verifyRefreshTokenService(refreshToken)

    // Sign new access token
    const newAccessToken = await jwtServices.signAccessTokenService(verifyResponse.payload)

    // Sign new refresh token
    const newRefreshToken = await jwtServices.signRefreshTokenService({
      payload: verifyResponse.payload,
      exp: verifyResponse.exp
    })

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken
      },
      message: 'Refresh access token successfully'
    })
  } catch (error) {
    logging.error('Refresh access token controller has error', error)
    return next(createError(500))
  }
}

export default refreshAccessTokenController
