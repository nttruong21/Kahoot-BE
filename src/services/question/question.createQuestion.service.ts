import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { Question } from '../../models/kahoot.model'

const createQuestionService = async (kahootId: number, question: Question): Promise<number | null> => {
  try {
    const query = 'INSERT INTO questions(kahoot_id, type, media, time_limit, point, question) VALUES(?, ?, ?, ?, ?, ?)'
    const params = [kahootId, question.type, question.media, question.timeLimit, question.point, question.question]
    const response = await executeQuery<any>(query, params)
    return response ? parseInt(response.insertId) : null
  } catch (error) {
    logging.error('Create question service has error', error)
    throw error
  }
}

export default createQuestionService
