import logging from '../../utils/logging.util'
import { QuizQuestion } from '../../models/kahoot.model'
import { executeQuery } from '../../configs/database.config'

const updateQuizQuestionService = async (question: QuizQuestion): Promise<void> => {
  try {
    const query =
      'UPDATE questions SET type = ?, media = ?, time_limit = ?, point = ?, question = ?, answer = ?, in_order = ? WHERE id = ?'
    const params = [
      question.type,
      question.media,
      question.timeLimit,
      question.point,
      question.question,
      question.answer,
      question.inOrder,
      question.id
    ]
    return await executeQuery(query, params)
  } catch (error) {
    logging.error('Update quiz question service has error', error)
    throw error
  }
}

export default updateQuizQuestionService
