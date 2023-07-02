import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const key = fs.readFileSync(path.resolve('./src/privkey.pem'), 'utf8')

const decrypt = (encrypt: string): string => {
  const buffer = Buffer.from(encrypt, 'base64')
  const decrypted = crypto.publicDecrypt(key, buffer)
  return decrypted.toString('utf8')
}

export default decrypt
