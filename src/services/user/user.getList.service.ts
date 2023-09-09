import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const getUsersList = async ({
  limit,
  offset,
  sessionUserId
}: {
  limit: number
  offset: number
  sessionUserId: number | null
}) => {
  try {
    const query = `
      SELECT users.id, users.username, users.image, COUNT(kahoots.id) AS number
      FROM users
      INNER JOIN kahoots ON users.id = kahoots.user_id
      WHERE users.id != ?
      GROUP BY users.id
      HAVING number > 0
      LIMIT ? OFFSET ?
    `
    const params = [sessionUserId ?? -1, limit, offset]
    console.log(params)
    return executeQuery<{ id: number; username: string; image: string }[]>(query, params)
  } catch (error) {
    logging.error('Get users list service has error:', error)
    throw error
  }
}
export default getUsersList
