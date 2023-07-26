import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { QuizAnswer } from '../../models/kahoot.model'

const createAnswerService = async (questionId: number, answer: QuizAnswer): Promise<number | null> => {
  try {
    const query = 'INSERT INTO answers(question_id, text, image, is_correct, in_order) VALUES(?, ?, ?, ?, ?)'
    const params = [questionId, answer.text, answer.image, answer.isCorrect, answer.inOrder]

    const response = await executeQuery<any>(query, params)
    return response ? parseInt(response.insertId) : null
  } catch (error) {
    logging.error('Create answer service has error', error)
    throw error
  }
}

export default createAnswerService
