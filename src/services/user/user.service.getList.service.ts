import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const getUsersList = async ({ limit, offset }: { limit: number; offset: number }) => {
  try {
    const query = 'SELECT id, name from users LIMIT ? OFFSET ?'
    const params = [limit, offset]
    return executeQuery<{ id: number; name: string }[]>(query, params)
  } catch (error) {
    logging.error('Get users list service has error:', error)
    throw error
  }
}
export default getUsersList
