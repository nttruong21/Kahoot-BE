import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Args {
  userId: number
  kahootId: number | null
  assignmentId: number | null
  point: number
}

const createPlayService = async ({ userId, kahootId, assignmentId, point }: Args) => {
  try {
    const query = 'INSERT INTO plays (user_id, kahoot_id, assignment_id, point) VALUES (?, ?, ?, ?)'
    const params = [userId, kahootId, assignmentId, point]
    const response = await executeQuery<any>(query, params)
    return response ? parseInt(response.insertId) : null
  } catch (error) {
    logging.error('Create play service has error:', error)
    throw error
  }
}

export default createPlayService
