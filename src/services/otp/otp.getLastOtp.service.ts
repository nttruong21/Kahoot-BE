import logging from '~/utils/logging.util'
import { executeQuery } from '~/configs/database.config'

const getLastOtpService = async (email: String, otp?: string) => {
  try {
    const query = otp
      ? 'SELECT * FROM otps WHERE email = ? AND otp = ? ORDER BY expired DESC LIMIT 1'
      : 'SELECT * FROM otps WHERE email = ? ORDER BY expired DESC LIMIT 1'
    const params = otp ? [email, otp] : [email]
    const response = await executeQuery(query, params)
    return response[0]
  } catch (error) {
    logging.error('Get last otp by email service has error: ', error)
    throw error
  }
}

export default getLastOtpService
