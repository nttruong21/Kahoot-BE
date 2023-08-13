import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Args {
  playId: number
  answers: Array<number | boolean>
}

const createPlayAnswersService = async ({ playId, answers }: Args) => {
  try {
    let query = 'INSERT INTO play_answers (play_id, answer_id, tf_answer, in_order) VALUES '
    let params: any[] = []
    answers.forEach((answer, index) => {
      query += index === 0 ? '(?, ?, ?, ?)' : ',(?, ?, ?, ?)'
      params = Number.isInteger(answer)
        ? [...params, playId, answer, null, index + 1]
        : [...params, playId, null, answer, index + 1]
    })
    const response = await executeQuery<any>(query, params)
    return response.affectedRows === answers.length
  } catch (error) {
    logging.error('Create play service has error:', error)
    throw error
  }
}

export default createPlayAnswersService
