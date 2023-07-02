import { executeQuery } from '~/configs/database.config'

import logging from '~/utils/logging.util'

const createOtpService = async (email: string, otp: string, expired: Date) => {
  try {
    const query = 'INSERT INTO otps (email, otp, expired) VALUES(?, ?, ?)'
    const params = [email, otp, expired]
    executeQuery(query, params)
  } catch (error) {
    logging.error('Create otp service has error', error)
    throw error
  }
}

export default createOtpService
