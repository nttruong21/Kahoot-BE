import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

import * as cookieServices from '~/services/cookie/cookie.index.service'
import logging from '~/utils/logging.util'
import resetCookie from '~/utils/resetCookie.util'

const validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const encryptAccessToken = req.cookies?.['access-token']?.trim()
  if (!encryptAccessToken) {
    resetCookie(res)
    logging.error('Not found access token in cookie')
    return next(createError(401, 'Not found access token in cookie'))
  }

  const token = cookieServices.decrypt(encryptAccessToken)
  if (!token) {
    resetCookie(res)
    logging.error('Invalid token')
    return next(createError(401, 'Invalid token'))
  }

  if (process.env.ACCESS_TOKEN_SECRET) {
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err: any, decoded: any) {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            logging.error('Token expired error')
            return next(createError(403, 'Token expired error'))
          } else {
            resetCookie(res)
            logging.error('Token verification has error')
            return next(createError(401, 'Token verification has error'))
          }
        }

        const { id } = decoded
        req.user = {
          id
        }
        return next()
      })
    } catch (error) {
      resetCookie(res)
      logging.error('Verify token failure')
      return next(createError(401, 'Verify token failure'))
    }
  }
}

export default validateAccessToken
