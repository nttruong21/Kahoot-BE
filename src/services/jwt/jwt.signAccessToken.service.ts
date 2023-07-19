import jwt from 'jsonwebtoken'

import { TokenPayload } from '../../types/tokenPayload.type'

const signAccessTokenService = async (payload: TokenPayload): Promise<string> => {
  return new Promise((resolve, reject) => {
    const secret = process.env.ACCESS_TOKEN_SECRET
    const options = {
      expiresIn: '1h'
    }
    if (secret) {
      jwt.sign(payload, secret, options, (err, token) => {
        err && reject(err)
        token && resolve(token)
      })
    }
  })
}

export default signAccessTokenService
