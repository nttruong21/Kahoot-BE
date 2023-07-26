import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'

const deleteAnswersService = async (args: { questionId?: number; answerIds?: number[] }): Promise<void> => {
  try {
    if (args.questionId) {
      const query = 'DELETE FROM answers WHERE question_id = ?'
      const params = [args.questionId]
      return await executeQuery<void>(query, params)
    }
    if (args.answerIds) {
      let query = 'DELETE FROM answers WHERE id IN('
      const params: any[] | undefined = []
      args.answerIds.forEach((answerId, index) => {
        query += index === 0 ? '?' : ', ?'
        params.push(answerId)
      })
      query += ')'
      return await executeQuery<void>(query, params)
    }
  } catch (error) {
    logging.error('Delete answers service has error', error)
    throw error
  }
}

export default deleteAnswersService
