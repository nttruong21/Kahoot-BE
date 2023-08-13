import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Args {
  questionId: number
}

interface Response {
  id: number
  text: string | null
  image: string | null
}

const getCorrectAnswerOfQuizQuestionService = async ({ questionId }: Args) => {
  try {
    const query = `
			SELECT answers.id, answers.text, answers.image
			FROM answers
			WHERE answers.is_correct = 1 AND answers.question_id = ?
			LIMIT 1
		`
    const params = [questionId]
    const response = await executeQuery<Response[]>(query, params)
    return response ? response[0] : null
  } catch (error) {
    logging.error('Get correct answer service has error:', error)
    throw error
  }
}

export default getCorrectAnswerOfQuizQuestionService
