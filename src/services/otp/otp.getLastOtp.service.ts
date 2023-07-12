import logging from '~/utils/logging.util'
import { executeQuery } from '~/configs/database.config'
import { OtpModel } from '~/models/otp.model'

const getLastOtpService = async (email: String) => {
  try {
    const query = 'SELECT * FROM otps WHERE email = ? ORDER BY expired DESC LIMIT 1'

    const params = [email]
    const response = await executeQuery<OtpModel[]>(query, params)
    return response[0]
  } catch (error) {
    logging.error('Get last otp by email service has error: ', error)
    throw error
  }
}

export default getLastOtpService
