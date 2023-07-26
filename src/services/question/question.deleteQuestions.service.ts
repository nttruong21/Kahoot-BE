import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'

const deleteQuestionsService = async (args: { questionsIds?: number[] }): Promise<void> => {
  try {
    if (args.questionsIds) {
      let query = 'DELETE FROM questions WHERE id IN('
      const params: any[] | undefined = []
      args.questionsIds.forEach((questionId, index) => {
        query += index === 0 ? '?' : ', ?'
        params.push(questionId)
      })
      query += ')'
      return await executeQuery<void>(query, params)
    }
  } catch (error) {
    logging.error('Delete questions service has error', error)
    throw error
  }
}

export default deleteQuestionsService
