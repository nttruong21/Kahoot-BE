import jwt, { JwtPayload } from 'jsonwebtoken'

import redisClient from '../../configs/redis.config'
import { TokenPayload } from '../../types/tokenPayload.type'

const verifyRefreshTokenService = (
  refreshToken: string
): Promise<{
  payload: TokenPayload
  exp?: number
}> => {
  return new Promise(async (resolve, reject) => {
    const secret = process.env.REFRESH_TOKEN_SECRET
    if (secret) {
      try {
        const decoded: JwtPayload = jwt.verify(refreshToken, secret) as JwtPayload
        // Get payload
        const { id, exp } = decoded

        console.log(decoded)

        // Get refresh token by id in redis
        const refreshTokenOnRedis = await redisClient.get(id.toString())
        if (refreshTokenOnRedis === null || refreshToken !== refreshTokenOnRedis) {
          reject('Invalid refresh token')
        } else {
          resolve({ payload: { id }, exp })
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
