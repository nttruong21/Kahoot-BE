import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const createAssignmentService = async ({
  userId,
  kahootId,
  pin
}: {
  userId: number
  kahootId: number
  pin: string
}) => {
  try {
    const query = 'INSERT INTO assignments (user_id, kahoot_id, pin) VALUES (?, ?, ?)'
    const params = [userId, kahootId, pin]
    const response = await executeQuery<any>(query, params)
    return response ? parseInt(response.insertId) : null
  } catch (error) {
    logging.error('Create assignment service has error:', error)
    throw error
  }
}

export default createAssignmentService
