import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const createAssignmentService = async ({
  userId,
  kahootId,
  pin,
  expiredAt
}: {
  userId: number
  kahootId: number
  pin: string
  expiredAt: number
}) => {
  try {
    const query = 'INSERT INTO assignments (user_id, kahoot_id, pin, expired_at) VALUES (?, ?, ?, ?)'
    const params = [userId, kahootId, pin, new Date(expiredAt)]
    const response = await executeQuery<any>(query, params)
    return response ? parseInt(response.insertId) : null
  } catch (error) {
    logging.error('Create assignment service has error:', error)
    throw error
  }
}

export default createAssignmentService
