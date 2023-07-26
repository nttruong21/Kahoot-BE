import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { QuizAnswer } from '../../models/kahoot.model'

const getAnswersService = async (questionId: number): Promise<QuizAnswer[]> => {
  try {
    const query =
      'SELECT id, text, image, is_correct as isCorrect, in_order as inOrder from answers WHERE question_id = ? ORDER BY inOrder ASC'
    const params = [questionId]

    const response = await executeQuery<QuizAnswer[]>(query, params)
    return response
  } catch (error) {
    logging.error('Create answer service has error', error)
    throw error
  }
}

export default getAnswersService
