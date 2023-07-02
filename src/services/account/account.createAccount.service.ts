import logging from '~/utils/logging.util'

import { executeQuery } from '~/configs/database.config'

const createAccountService = async (email: string, password: string, date: Date) => {
  try {
    const query = 'INSERT INTO accounts(email, password, created_at) VALUES(?, ?, ?)'
    const params = [email, password, date]
    const response = await executeQuery(query, params)
    return parseInt(response.insertId)
  } catch (error) {
    logging.error('Create account service has error', error)
    throw error
  }
}

export default createAccountService
