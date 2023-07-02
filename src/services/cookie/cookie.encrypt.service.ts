import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const key = fs.readFileSync(path.resolve('./src/privkey.pem'), 'utf8')

const encrypt = (decrypt: string): string => {
  const buffer = Buffer.from(decrypt)
  const encrypted = crypto.privateEncrypt(key, buffer)
  return encrypted.toString('base64')
}

export default encrypt
