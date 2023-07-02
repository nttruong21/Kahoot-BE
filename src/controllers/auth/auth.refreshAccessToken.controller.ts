import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import dayjs from 'dayjs'

import logging from '~/utils/logging.util'
import resetCookie from '~/utils/resetCookie.util'
import * as cookieServices from '~/services/cookie/cookie.index.service'
import * as jwtServices from '~/services/jwt/jwt.index.service'

const refreshAccessTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const encryptRefreshToken = req.cookies['refresh-token']
    if (!encryptRefreshToken) {
      resetCookie(res)
      return next(createError(401))
    }

    const decryptRefreshToken = cookieServices.decrypt(encryptRefreshToken)

    // Verify refresh token
    const payload = await jwtServices.verifyRefreshTokenService(decryptRefreshToken)

    // Sign new access token
    const newAccessToken = await jwtServices.signAccessTokenService(payload)

    // Set cookie
    res.cookie('access-token', cookieServices.encrypt(newAccessToken), {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
      expires: dayjs().add(30, 'day').toDate(),
      sameSite: true
    })

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Refresh access token successfully'
    })
  } catch (error) {
    logging.error('Refresh access token controller has error', error)
    resetCookie(res)
    return next(createError(401))
  }
}

export default refreshAccessTokenController
