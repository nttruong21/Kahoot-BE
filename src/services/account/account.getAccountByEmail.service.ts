import { executeQuery } from '~/configs/database.config'
import logging from '~/utils/logging.util'

const getAccountByEmailService = async (email: string) => {
  try {
    const query = 'SELECT * FROM accounts WHERE email = ? LIMIT 1'
    const params = [email]
    const response = await executeQuery(query, params) // []
    return response[0]
  } catch (error) {
    logging.error('Get account by email service has error', error)
    throw error
  }
}

export default getAccountByEmailService
