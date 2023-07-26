import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { QuizQuestion } from '../../models/kahoot.model'

const createQuizQuestionService = async (kahootId: number, question: QuizQuestion): Promise<number | null> => {
  try {
    const query =
      'INSERT INTO questions(kahoot_id, type, media, time_limit, point, question, in_order) VALUES(?, ?, ?, ?, ?, ?, ?)'
    const params = [
      kahootId,
      question.type,
      question.media,
      question.timeLimit,
      question.point,
      question.question,
      question.inOrder
    ]
    const response = await executeQuery<any>(query, params)
    return response ? parseInt(response.insertId) : null
  } catch (error) {
    logging.error('Create quiz question service has error', error)
    throw error
  }
}

export default createQuizQuestionService
