import logging from '~/utils/logging.util'

import { executeQuery } from '~/configs/database.config'

const createUserService = async (accountId: number, username: string, image: string, date: Date) => {
  try {
    const query = 'INSERT INTO users(id, username, name, image, created_at) VALUES(?, ?, ?, ?, ?)'
    const params = [accountId, username, username, image, date]
    await executeQuery(query, params)
  } catch (error) {
    logging.error('Create user service has error', error)
    throw error
  }
}

export default createUserService
