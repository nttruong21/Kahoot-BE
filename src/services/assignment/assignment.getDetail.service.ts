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

const getAssignmentDetailService = async ({ id, pin }: { id?: number; pin?: string }) => {
  try {
    let query = ''
    let params: Array<string | number> = []
    if (id) {
      query = 'SELECT * FROM assignments WHERE id = ?'
      params = [id]
    }
    if (pin) {
      query = 'SELECT * FROM assignments WHERE pin = ?'
      params = [pin]
    }
    if (query && params.length > 0) {
      const response = await executeQuery<Response[]>(query, params)
      return response ? response[0] : null
    }
    return null
  } catch (error) {
    logging.error('Get assignment detail service has error:', error)
    throw error
  }
}

export default getAssignmentDetailService
