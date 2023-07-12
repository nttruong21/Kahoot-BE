import logging from '~/utils/logging.util'

import { executeQuery } from '~/configs/database.config'

const updatePasswordService = async (parameters: { id?: string; email?: string; password: string }): Promise<void> => {
  try {
    let query = undefined
    let params = undefined

    if (parameters.id) {
      query = 'UPDATE accounts SET password = ?, updated_at = ? WHERE id = ?'
      params = [parameters.password, new Date(), parameters.id]
    } else if (parameters.email) {
      query = 'UPDATE accounts SET password = ?, updated_at = ? WHERE email = ?'
      params = [parameters.password, new Date(), parameters.email]
    }

    if (query && params) {
      return await executeQuery<void>(query, params)
    }
    throw 'Update account password service has error: Invalid parameters'
  } catch (error) {
    logging.error('Update account password service has error has error', error)
    throw error
  }
}

export default updatePasswordService
