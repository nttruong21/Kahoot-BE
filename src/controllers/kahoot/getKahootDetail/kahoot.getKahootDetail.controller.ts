import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../../utils/logging.util'
import { QuestionType } from '../../../enums/kahoot.enum'
import * as kahootServices from '../../../services/kahoot/kahoot.index.service'
import * as questionServices from '../../../services/question/question.index.service'
import * as answerServices from '../../../services/answer/answer.index.service'
import * as playServices from '../../../services/play/play.index.service'
import * as favoritesService from '../../../services/favorites/favorites.index.service'

const getKahootDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const kahootId = +req.params['id']

    if (!Number.isInteger(kahootId) || kahootId < 1) {
      return next(createError(400))
    }

    // 1. Get kahoot by id
    const kahoot = await kahootServices.getKahoot({ kahootId })
    if (!kahoot) {
      return next(createError(500))
    }

    // 2. Get questions by kahoot id
    const questions = await questionServices.getQuestionsByKahootId(kahootId)
    if (!questions || questions.length === 0) {
      return next(createError(500))
    }

    // 3. Check question, id type = quiz -> get answers
    await Promise.all(
      questions.map(async (question) => {
        if (question.type === QuestionType.quiz) {
          // Get answers
          const answers = await answerServices.getAnswers(question.id!)
          if (!answers || answers.length === 0) {
            return next(createError(500))
          }
          question.answers = answers
        }
      })
    )

    // Get number of players
    const numberOfPlayer = await playServices.countPlayOfKahoot(kahootId)

    // Get number of favorite
    const usersFavorite = await favoritesService.getUsersFavorite(kahootId)

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        ...kahoot,
        numberOfPlayer,
        usersFavorite: usersFavorite ? usersFavorite : [],
        questions: questions
      },
      message: 'Get kahoot detail successfully'
    })
  } catch (error) {
    logging.error('Get kahoot detail controller has error', error)
    return next(createError(500))
  }
}

export default getKahootDetailController
