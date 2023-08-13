import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Args {
  playId: number
}

interface Response {
  answerId: number | null
  tfAnswer: number | null
  text: string | null
  image: string | null
}

const getAnswersService = async ({ playId }: Args) => {
  try {
    const query = `
      SELECT play_answers.answer_id as answerId, play_answers.tf_answer as tfAnswer, play_answers.in_order as inOrder, answers.text, answers.image 
      FROM play_answers
      LEFT JOIN answers ON play_answers.answer_id = answers.id
      WHERE play_id = ? 
      ORDER BY inOrder ASC
		`
    const params = [playId]
    const response = await executeQuery<Response[]>(query, params)
    return response ? response : null
  } catch (error) {
    logging.error('Get answers service has error:', error)
    throw error
  }
}

export default getAnswersService
