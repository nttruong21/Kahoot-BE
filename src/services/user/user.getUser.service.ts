import logging from '../../utils/logging.util'

import { executeQuery } from '../../configs/database.config'
import { UserModel } from '../../models/user.model'

const getUserByUsernameService = async (parameters: { id?: number; username?: string }) => {
  try {
    let query
    let params

    if (parameters.id && parameters.username) {
      query = 'SELECT * FROM users WHERE id = ? AND username = ? LIMIT 1'
      params = [parameters.id, parameters.username]
    } else if (parameters.id) {
      query = 'SELECT * FROM users WHERE id = ? LIMIT 1'
      params = [parameters.id]
    } else if (parameters.username) {
      query = 'SELECT * FROM users WHERE username = ? LIMIT 1'
      params = [parameters.username]
    }
    if (query && params) {
      const response = await executeQuery<UserModel[]>(query, params)
      return response[0]
    }
    return null
  } catch (error) {
    logging.error('Get user by username service has error', error)
    throw error
  }
}

export default getUserByUsernameService
