import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import validator from 'validator'

import logging from '../../utils/logging.util'
import * as playServices from '../../services/play/play.index.service'

interface RequestBody {
  kahootId: number | null
  assignmentId: number | null
  point: number
  answers: Array<number | boolean>
}

const createPlayController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { kahootId = null, assignmentId = null, point, answers } = req.body as RequestBody

    // Validation
    if (!kahootId && !assignmentId) {
      return next(createError(400, 'Must be one of both values: kahoot id | assignment id'))
    }
    if (kahootId && !Number.isInteger(kahootId)) {
      return next(createError(400, 'Invalid kahoot id'))
    }
    if (assignmentId && !Number.isInteger(assignmentId)) {
      return next(createError(400, 'Invalid assignment id'))
    }
    if (!point || !Number.isInteger(point) || point < 0) {
      return next(createError(400, 'Invalid point'))
    }
    if (!answers || !Array.isArray(answers) || answers.length < 1) {
      return next(createError(400, 'Invalid answers'))
    }

    let invalidAnswerValue = false
    answers.forEach((answer) => {
      if (invalidAnswerValue) {
        return
      }
      if (
        (!Number.isInteger(answer) && !validator.isBoolean(answer.toString())) ||
        (Number.isInteger(answer) && (answer as number) < 1)
      ) {
        invalidAnswerValue = true
        return
      }
    })
    if (invalidAnswerValue) {
      return next(createError(400, 'Invalid answer id value'))
    }

    // Create play
    const createdPlayId = await playServices.create({
      userId: req.user.id,
      kahootId,
      assignmentId,
      point
    })
    if (!createdPlayId) {
      return next(createError(500, 'Create play failure'))
    }

    // Create play answers
    await playServices.createPlayAnswers({
      playId: createdPlayId,
      answers
    })

    return res.status(200).json({
      code: 200,
      success: true,
      data: null,
      message: 'Create play successfully'
    })
  } catch (error) {
    logging.error('Create play controller has error', error)
    return next(createError(500))
  }
}

export default createPlayController
