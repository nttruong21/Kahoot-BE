import logging from '~/utils/logging.util'

import { executeQuery } from '~/configs/database.config'

const getUserByUsernameService = async (username: string) => {
  try {
    const query = 'SELECT * FROM users WHERE username = ? LIMIT 1'
    const params = [username]
    const response = await executeQuery(query, params)
    return response
  } catch (error) {
    logging.error('Get user by username service has error', error)
    throw error
  }
}

export default getUserByUsernameService
