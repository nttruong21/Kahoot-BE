import logging from '~/utils/logging.util'
import { executeQuery } from '~/configs/database.config'
import { Answer } from '~/models/kahoot.model'

const createAnswersService = async (questionId: number, answers: Answer[]): Promise<void> => {
  try {
    const query = answers.reduce((previousValue, currentValue, index, answers) => {
      return (previousValue += index === 0 ? '(?, ?, ?, ?)' : ',(?, ?, ?, ?)')
    }, 'INSERT INTO answers(question_id, text, image, is_correct) VALUES')

    const params = answers.flatMap((answer, index) => [questionId, answer.text, answer.image, answer.isCorrect])

    await executeQuery<any>(query, params)
  } catch (error) {
    logging.error('Create answers service has error', error)
    throw error
  }
}

export default createAnswersService
