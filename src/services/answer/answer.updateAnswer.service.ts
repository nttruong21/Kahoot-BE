import logging from '../../utils/logging.util'
import { QuizAnswer } from '../../models/kahoot.model'
import { executeQuery } from '../../configs/database.config'

const updateAnswerService = async (answer: QuizAnswer): Promise<void> => {
  try {
    const query = 'UPDATE answers SET text = ?, image = ?, is_correct = ?, in_order = ? WHERE id = ?'
    const params = [answer.text, answer.image, answer.isCorrect, answer.inOrder, answer.id]
    return await executeQuery<void>(query, params)
  } catch (error) {
    logging.error('Update answer service has error', error)
    throw error
  }
}

export default updateAnswerService
