import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const CountPlayersOfUserService = async ({ userId }: { userId: number }) => {
  try {
    const query = `
        SELECT plays.id
        FROM plays
        LEFT JOIN kahoots ON kahoots.id = plays.kahoot_id AND kahoots.user_id = ?
        LEFT JOIN (assignments) ON plays.assignment_id = assignments.id AND assignments.kahoot_id = kahoots.id AND kahoots.user_id = ?
      `
    const params = [userId, userId]
    const response = await executeQuery<Array<{ id: number }>>(query, params)
    return response ? response.length : null
  } catch (error) {
    logging.error('Count play of user service has error:', error)
    throw error
  }
}

export default CountPlayersOfUserService
