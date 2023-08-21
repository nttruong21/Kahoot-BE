import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Args {
  userId: number
  kahootId: number | null
  assignmentId: number | null
  point: number
  type: 'practice' | 'assignment'
}

const createPlayService = async ({ userId, kahootId, assignmentId, type, point }: Args) => {
  try {
    const query = 'INSERT INTO plays (user_id, kahoot_id, assignment_id, type, point) VALUES (?, ?, ?, ?, ?)'
    const params = [userId, kahootId, assignmentId, type, point]
    const response = await executeQuery<any>(query, params)
    return response ? parseInt(response.insertId) : null
  } catch (error) {
    logging.error('Create play service has error:', error)
    throw error
  }
}

export default createPlayService
