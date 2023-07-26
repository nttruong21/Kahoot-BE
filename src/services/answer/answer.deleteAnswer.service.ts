import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'

const deleteAnswerService = async (answerId: number): Promise<void> => {
  try {
    const query = 'DELETE FROM answers WHERE id = ?'
    const params = [answerId]
    return await executeQuery<void>(query, params)
  } catch (error) {
    logging.error('Delete answer service has error', error)
    throw error
  }
}

export default deleteAnswerService
