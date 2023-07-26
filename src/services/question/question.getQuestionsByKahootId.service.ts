import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { Question } from '../../models/kahoot.model'

const getQuestionsByKahootIdService = async (kahootId: number): Promise<Question[]> => {
  try {
    const query =
      'SELECT id, type, media, time_limit as timeLimit, point, question, answer, in_order as inOrder FROM questions WHERE kahoot_id = ? ORDER BY inOrder ASC'
    const params = [kahootId]
    const response = await executeQuery<Question[]>(query, params)
    return response
  } catch (error) {
    logging.error('Get kahoot by id service has error', error)
    throw error
  }
}

export default getQuestionsByKahootIdService
