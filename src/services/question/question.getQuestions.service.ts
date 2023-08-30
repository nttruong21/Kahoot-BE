import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { Question } from '../../models/kahoot.model'

const getQuestionsService = async ({ kahootId, assignmentId }: { kahootId?: number; assignmentId?: number }) => {
  try {
    if (kahootId) {
      const query = `
        SELECT id, type, media, time_limit as timeLimit, point, question, answer, in_order as inOrder 
        FROM questions WHERE kahoot_id = ? ORDER BY inOrder ASC`
      const params = [kahootId]
      return await executeQuery<Question[]>(query, params)
    }

    if (assignmentId) {
      const query = `
        SELECT questions.id, questions.type, questions.media, questions.time_limit as timeLimit, 
                questions.point, questions.question, questions.answer, questions.in_order as inOrder 
        FROM questions, assignments WHERE assignments.id = ? AND assignments.kahoot_id = questions.kahoot_id ORDER BY inOrder ASC`
      const params = [assignmentId]
      return await executeQuery<Question[]>(query, params)
    }

    return null
  } catch (error) {
    logging.error('Get kahoot by id service has error', error)
    throw error
  }
}

export default getQuestionsService
