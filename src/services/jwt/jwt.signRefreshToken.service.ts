import jwt from 'jsonwebtoken'

import redisClient from '../../configs/redis.config'
import { TokenPayload } from '../../types/tokenPayload.type'

const signRefreshTokenService = async (payload: TokenPayload): Promise<string> => {
  return new Promise((resolve, reject) => {
    const secret = process.env.REFRESH_TOKEN_SECRET
    const options = {
      expiresIn: '30d'
    }
    if (secret) {
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(err)
        }

        if (token) {
          // Save refresh token on redis
          redisClient.set(payload.id.toString(), token, {
            EX: 30 * 24 * 60 * 60
          })
          resolve(token)
        }
      })
    }
  })
}

export default signRefreshTokenService
