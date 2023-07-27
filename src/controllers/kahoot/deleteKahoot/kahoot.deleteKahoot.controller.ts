import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../../utils/logging.util'
import * as kahootServices from '../../../services/kahoot/kahoot.index.service'
import * as answerServices from '../../../services/answer/answer.index.service'
import * as questionServices from '../../../services/question/question.index.service'

const deleteKahootController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const kahootId = req.params['id'] ? +req.params['id'] : undefined
    if (!kahootId || !Number.isInteger(kahootId) || kahootId < 1) {
      return next(createError(400))
    }

    // Get kahoot by id
    const kahoot = await kahootServices.getKahoot({ kahootId })
    if (!kahoot) {
      return next(createError(400))
    }

    // Delete answers
    await answerServices.deleteAnswers({ kahootId })

    // Delete questions
    await questionServices.deleteQuestions({ kahootId })

    // Delete kahoot
    await kahootServices.deleteKahoot({ kahootId })

    return res.status(200).json({
      code: 200,
      success: true,
      data: kahootId,
      message: 'Delete kahoot successfully'
    })
  } catch (error) {
    logging.error('Delete kahoot controller has error', error)
    return next(createError(500))
  }
}

export default deleteKahootController
