import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import { File } from 'formidable'

import validateCreatingKahootFormDataController from './kahoot.validateCreatingKahootFormData.controller'
import logging from '../../../utils/logging.util'
import myFormidable from '../../../configs/formidable.config'
import { Kahoot } from '../../../models/kahoot.model'
import * as kahootServices from '../../../services/kahoot/kahoot.index.service'
import * as questionServices from '../../../services/question/question.index.service'
import * as answerServices from '../../../services/answer/answer.index.service'

const createKahootController = async (req: Request, res: Response, next: NextFunction) => {
  myFormidable.parse(req, async (err, fields, files) => {
    if (err) {
      logging.error('Form parser has error', err)
      return next(createError(500))
    }

    // logging.info('Fields', fields)
    // logging.info('Files', files)

    // Get body data
    const kahootBodyData: Kahoot = fields['kahoot'] ? JSON.parse(fields['kahoot'][0]) : null
    const images = files['images'] as Array<File>

    // logging.info('data', kahoot)
    // logging.info('images', images)

    // Validate kahoot body
    validateCreatingKahootFormDataController(req, res, next, kahootBodyData)

    try {
      // Create kahoot
      const kahootCreatedId = await kahootServices.createKahoot(kahootBodyData)
      if (!kahootCreatedId) {
        return next(createError(500, 'Create kahoot failure'))
      }

      // Create questions
      await Promise.all(
        kahootBodyData.questions.map(async (question) => {
          const questionCreatedId = await questionServices.createQuestion(kahootCreatedId, question)
          if (!questionCreatedId) {
            return next(createError(500, 'Create question failure'))
          }
          await answerServices.createAnswers(questionCreatedId, question.answers)
        })
      )

      return res.status(200).json({
        code: 200,
        success: true,
        data: {},
        message: 'Create kahoot successfully'
      })
    } catch (error) {
      logging.error('Create kahoot controller has error', error)
      return next(createError(500))
    }
  })
}

export default createKahootController
