import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

const validateAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const headerAuthorization = req.headers.authorization
  if (!headerAuthorization) {
    return next()
  }

  // Get access token
  const accessToken = headerAuthorization.split('Bearer')[1]
    ? headerAuthorization.split('Bearer')[1].toString().trim()
    : null

  if (!accessToken) {
    return next()
  }

  if (process.env.ACCESS_TOKEN_SECRET) {
    try {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function (err: any, decoded: any) {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return next(createError(403, 'Token expired error'))
          } else {
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
      return next()
    }
  }
}

export default validateAccessToken
