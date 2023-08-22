import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Response {
  id: number
  user_id: number
  kahoot_id: number
  pin: string
  expired_at: Date
  created_at: Date
}

const getAssignmentDetailService = async ({ id }: { id: number }) => {
  try {
    const query = 'SELECT * FROM assignments WHERE id = ?'
    const params = [id]
    const response = await executeQuery<Response[]>(query, params)
    return response ? response[0] : null
  } catch (error) {
    logging.error('Get assignment detail service has error:', error)
    throw error
  }
}

export default getAssignmentDetailService
