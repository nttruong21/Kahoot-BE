import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const getUsersList = async ({ limit, offset }: { limit: number; offset: number }) => {
  try {
    const query = `
      SELECT users.id, users.username, COUNT(kahoots.id) AS number
      FROM users
      INNER JOIN kahoots ON users.id = kahoots.user_id
      GROUP BY users.id
      HAVING number > 0
      LIMIT ? OFFSET ?
    `
    const params = [limit, offset]
    return executeQuery<{ id: number; username: string }[]>(query, params)
  } catch (error) {
    logging.error('Get users list service has error:', error)
    throw error
  }
}
export default getUsersList
