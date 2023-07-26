import logging from '../../utils/logging.util'
import { TrueOrFalseQuestion } from '../../models/kahoot.model'
import { executeQuery } from '../../configs/database.config'

const updateTrueOrFalseQuestionService = async (question: TrueOrFalseQuestion): Promise<void> => {
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
    logging.error('Update true or false question service has error', error)
    throw error
  }
}

export default updateTrueOrFalseQuestionService
