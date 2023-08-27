import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const CountPlayOfUserService = async ({ userId }: { userId: number }) => {
  try {
    const query = 'SELECT id, COUNT(*) as count FROM plays WHERE user_id = ?'
    const params = [userId]
    const response = await executeQuery<Array<{ id: number; count: number }>>(query, params)
    return response ? response[0].count : null
  } catch (error) {
    logging.error('Count play of user service has error:', error)
    throw error
  }
}

export default CountPlayOfUserService
