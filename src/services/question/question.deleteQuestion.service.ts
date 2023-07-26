import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const deleteQuestionService = async (questionId: number): Promise<void> => {
  try {
    const query = 'DELETE FROM questions WHERE id = ?'
    const params = [questionId]
    return await executeQuery<void>(query, params)
  } catch (error) {
    logging.error('Delete question service has error', error)
    throw error
  }
}

export default deleteQuestionService
