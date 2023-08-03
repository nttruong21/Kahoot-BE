import jwt from 'jsonwebtoken'

import redisClient from '../../configs/redis.config'
import { TokenPayload } from '../../types/tokenPayload.type'

const signRefreshTokenService = async ({ payload, exp }: { payload: TokenPayload; exp?: number }): Promise<string> => {
  return new Promise((resolve, reject) => {
    const secret = process.env.REFRESH_TOKEN_SECRET

    const expiresTime = exp ? exp - Math.floor(Date.now() / 1000) : 30 * 24 * 60 * 60

    const options = {
      expiresIn: expiresTime
    }
    if (secret) {
      jwt.sign(payload, secret, options, async (err, token) => {
        if (err) {
          reject(err)
        }
        if (token) {
          // Save refresh token on redis
          console.log('expiresTime: ', expiresTime)
          await redisClient.set(payload.id.toString(), token, {
            EX: expiresTime
          })
          resolve(token)
        }
      })
    }
  })
}

export default signRefreshTokenService
