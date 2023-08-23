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
			SELECT plays.id, plays.user_id as userId, plays.point, users.username, users.image as userImage
			FROM plays, users
			WHERE plays.kahoot_id = ? AND plays.user_id AND plays.user_id = users.id
			ORDER BY POINT LIMIT ?		
			`
      params = [kahootId, limit]
    }

    if (assignmentId) {
      query = `
			SELECT plays.id, plays.user_id as userId, plays.point, users.username, users.image as userImage
			FROM plays, users
			WHERE plays.assignment_id = ? AND plays.user_id AND plays.user_id = users.id
			ORDER BY POINT LIMIT ?		
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
