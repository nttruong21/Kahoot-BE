import jwt from 'jsonwebtoken'

import redisClient from '../../configs/redis.config'
import { TokenPayload } from '../../types/tokenPayload.type'
import logging from '../../utils/logging.util'

const verifyRefreshTokenService = (refreshToken: string): Promise<TokenPayload> => {
  return new Promise(async (resolve, reject) => {
    const secret = process.env.REFRESH_TOKEN_SECRET
    if (secret) {
      try {
        const decoded: any = jwt.verify(refreshToken, secret)
        // Get payload
        const { id } = decoded

        // Get refresh token by id in redis
        const refreshTokenOnRedis = await redisClient.get(id.toString())
        if (refreshTokenOnRedis === null || refreshToken !== refreshTokenOnRedis) {
          reject('Invalid refresh token')
        } else {
          resolve({ id })
        }
      } catch (error: any) {
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
