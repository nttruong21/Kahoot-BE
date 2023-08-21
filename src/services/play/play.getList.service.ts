import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Args {
  userId: number
}

interface Response {
  id: number
  userId: number
  createdAt: Date
  kahootId: number | null
  assignmentId: number | null
}

const getPlaysListService = async ({ userId }: Args): Promise<Response[]> => {
  try {
    const query = `
			SELECT id AS id, user_id AS userId, created_at AS createdAt, kahoot_id AS kahootId, assignment_id AS assignmentId, type 
			FROM plays
			WHERE plays.user_id = ? 
			ORDER BY createdAt DESC`
    const params = [userId]
    return await executeQuery(query, params)
  } catch (error) {
    logging.error('Get plays list service has error:', error)
    throw error
  }
}
export default getPlaysListService
