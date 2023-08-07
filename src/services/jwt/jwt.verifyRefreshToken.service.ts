import jwt, { JwtPayload } from 'jsonwebtoken'

import redisClient from '../../configs/redis.config'
import { TokenPayload } from '../../types/tokenPayload.type'
import logging from '../../utils/logging.util'

const verifyRefreshTokenService = (
  refreshToken: string
): Promise<{
  payload: TokenPayload
  exp?: number
}> => {
  return new Promise(async (resolve, reject) => {
    const secret = process.env.REFRESH_TOKEN_SECRET
    console.log('Refresh token that client sent:', refreshToken)
    if (secret) {
      try {
        const decoded: JwtPayload = jwt.verify(refreshToken, secret) as JwtPayload
        // Get payload
        const { id, exp } = decoded

        // Get refresh token by id in redis
        const refreshTokenOnRedis = await redisClient.get(id.toString())

        logging.info('Refresh token on redis:', refreshTokenOnRedis)
        if (refreshTokenOnRedis === null || refreshToken !== refreshTokenOnRedis) {
          reject('Invalid refresh token')
        } else {
          resolve({ payload: { id }, exp })
        }
      } catch (error: any) {
        console.error(error)
        // Token expired
        if (error.name === 'TokenExpiredError') {
          reject('Refresh token expired')
        }
        reject('Verify refresh token failure')
      }
    }
  })
}

export default verifyRefreshTokenService
