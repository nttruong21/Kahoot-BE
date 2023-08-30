import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Player {
  id: number
  userId: number
  point: number
  username: string
  userImage: string
}

const getTopPlayers = async ({
  kahootId,
  assignmentId,
  limit
}: {
  kahootId?: number
  assignmentId?: number
  limit: number
}) => {
  try {
    let query = ''
    let params: number[] = []

    if (kahootId) {
      query = `
        SELECT p.id, p.user_id as userId, MAX(p.point) as point, u.username, u.image as userImage 
        FROM plays p 
        JOIN users u ON p.user_id = u.id 
        WHERE p.kahoot_id = ? 
        GROUP BY p.user_id 
        ORDER BY point DESC 
        LIMIT ?;
			`
      params = [kahootId, limit]
    }

    if (assignmentId) {
      query = `
  			SELECT p.id, p.user_id as userId, MAX(p.point) as point, u.username, u.image as userImage 
        FROM plays p 
        JOIN users u ON p.user_id = u.id 
        WHERE p.assignment_id = ? 
        GROUP BY p.user_id 
        ORDER BY point DESC 
        LIMIT ?;
			`
      params = [assignmentId, limit]
    }

    if (query && params.length > 0) {
      const response = await executeQuery<Player[]>(query, params)
      return response ? response : null
    }
    return null
  } catch (error) {
    logging.error('Get top players service has error:', error)
    throw error
  }
}

export default getTopPlayers
