import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import { QuestionType } from '../../enums/kahoot.enum'
import * as assignmentServices from '../../services/assignment/assignment.index.service'
import * as kahootServices from '../../services/kahoot/kahoot.index.service'
import * as questionServices from '../../services/question/question.index.service'
import * as answerServices from '../../services/answer/answer.index.service'

const getAssignmentDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pin = req.query.pin ? req.query.pin.toString() : null

    if (!pin) {
      return next(createError(400, 'Invalid pin'))
    }

    // Get assignment by pin
    const assignment = await assignmentServices.getDetail({ pin })
    if (!assignment) {
      return next(createError(500, `Can not find assignment with this pin: ${pin}`))
    }
    if (!assignment.kahoot_id) {
      return next(createError(500, `Can not find kahoot id with this pin: ${pin}`))
    }

    // Get kahoot detail
    // Get kahoot by id
    const kahoot = await kahootServices.getKahoot({ kahootId: assignment.kahoot_id })
    if (!kahoot) {
      return next(createError(500, 'Get kahoot failure'))
    }

    // Get questions by kahoot id
    const questions = await questionServices.getQuestionsByKahootId(assignment.kahoot_id)
    if (!questions || questions.length === 0) {
      return next(createError(500, 'Get questions failure'))
    }

    // Check question, id type = quiz -> get answers
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

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        ...kahoot,
        id: assignment.id,
        kahootId: kahoot.id,
        questions: questions
      },
      message: 'Get assignment detail successfully'
    })
  } catch (error) {
    logging.error('Get assignment detail controller has error:', error)
    return next(createError(500, 'Get assignment detail failure'))
  }
}

export default getAssignmentDetailController
