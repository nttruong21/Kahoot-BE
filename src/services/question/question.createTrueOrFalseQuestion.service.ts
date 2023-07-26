import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { TrueOrFalseQuestion } from '../../models/kahoot.model'

const createTrueOrFalseQuestionService = async (
  kahootId: number,
  question: TrueOrFalseQuestion
): Promise<number | null> => {
  try {
    const query =
      'INSERT INTO questions(kahoot_id, type, media, time_limit, point, question, answer, in_order) VALUES(?, ?, ?, ?, ?, ?, ?, ?)'
    const params = [
      kahootId,
      question.type,
      question.media,
      question.timeLimit,
      question.point,
      question.question,
      question.answer,
      question.inOrder
    ]
    const response = await executeQuery<any>(query, params)
    return response ? parseInt(response.insertId) : null
  } catch (error) {
    logging.error('Create true or false question service has error', error)
    throw error
  }
}

export default createTrueOrFalseQuestionService
