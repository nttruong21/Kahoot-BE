import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import validateCreatingKahootFormDataController from './kahoot.validateCreatingKahootFormData.controller'
import logging from '../../../utils/logging.util'
import myFormidable from '../../../configs/formidable.config'
import { Kahoot, QuizQuestion, TrueOrFalseQuestion } from '../../../models/kahoot.model'
import * as kahootServices from '../../../services/kahoot/kahoot.index.service'
import * as questionServices from '../../../services/question/question.index.service'
import * as answerServices from '../../../services/answer/answer.index.service'
import { QuestionType } from '../../../enums/kahoot.enum'
import { uploadImage } from '../../../configs/firebaseUpload.config'

const createKahootController = async (req: Request, res: Response, next: NextFunction) => {
  myFormidable.parse(req, async (err, fields, files) => {
    if (err) {
      logging.error('Form parser has error', err)
      return next(createError(500))
    }

    // logging.info('Fields:', fields)
    // logging.info('Files:', files)

    // Get body data
    const kahootBodyData: Kahoot = fields['kahoot'] ? JSON.parse(fields['kahoot'][0]) : null
    kahootBodyData.userId = req.user.id
    // const images = files['images'] as Array<File>

    // Validate kahoot body
    const validateError = validateCreatingKahootFormDataController(kahootBodyData)
    if (validateError) {
      console.log(validateError)
      return next(createError(400, validateError))
    }

    try {
      // Create kahoot
      if (kahootBodyData.coverImage) {
        kahootBodyData.coverImage = await uploadImage(kahootBodyData.coverImage)
      }
      const kahootCreatedId = await kahootServices.createKahoot(kahootBodyData)
      if (!kahootCreatedId) {
        return next(createError(500, 'Create kahoot failure'))
      }
      kahootBodyData.id = kahootCreatedId

      // Create questions
      await Promise.all(
        kahootBodyData.questions.map(async (question, index) => {
          if (question.type === QuestionType.quiz) {
            // Create quiz question
            const quizQuestion = question as QuizQuestion
            quizQuestion.inOrder = index + 1
            if (quizQuestion.media) {
              quizQuestion.media = await uploadImage(quizQuestion.media)
            }
            const questionCreatedId = await questionServices.createQuizQuestion(kahootCreatedId, quizQuestion)
            if (!questionCreatedId) {
              return next(createError(500, 'Create question failure'))
            }
            quizQuestion.id = questionCreatedId

            // Create answers
            await Promise.all(
              quizQuestion.answers.map(async (answer, index) => {
                answer.inOrder = index + 1
                if (answer.image) {
                  answer.image = await uploadImage(answer.image)
                }
                const answerId = await answerServices.createAnswer(questionCreatedId, answer)
                if (!answerId) {
                  return next(createError(500))
                }
                answer.id = answerId
              })
            )
          } else if (question.type === QuestionType.trueorfalse) {
            // Create true or false question
            const trueOrFalseQuestion = question as TrueOrFalseQuestion
            trueOrFalseQuestion.inOrder = index + 1
            if (trueOrFalseQuestion.media) {
              trueOrFalseQuestion.media = await uploadImage(trueOrFalseQuestion.media)
            }
            const questionCreatedId = await questionServices.createTrueOrFalseQuestion(
              kahootCreatedId,
              trueOrFalseQuestion
            )
            if (!questionCreatedId) {
              return next(createError(500, 'Create question failure'))
            }
            trueOrFalseQuestion.id = questionCreatedId
          }
        })
      )

      return res.status(200).json({
        code: 200,
        success: true,
        data: {
          id: kahootBodyData.id,
          userId: kahootBodyData.userId,
          coverImage: kahootBodyData.coverImage,
          title: kahootBodyData.title,
          theme: kahootBodyData.theme,
          description: kahootBodyData.description ?? null,
          media: kahootBodyData.media ?? null,
          visibleScope: kahootBodyData.visibleScope,
          questions: kahootBodyData.questions.map((question) => {
            if (question.type === QuestionType.quiz) {
              const quizQuestion = question as QuizQuestion
              return {
                id: quizQuestion.id,
                type: quizQuestion.type,
                media: quizQuestion.media ?? null,
                timeLimit: quizQuestion.timeLimit,
                point: quizQuestion.point,
                question: quizQuestion.question,
                inOrder: quizQuestion.inOrder,
                answers: quizQuestion.answers.map((answer) => ({
                  id: answer.id,
                  text: answer.text ?? null,
                  image: answer.image ?? null,
                  isCorrect: answer.isCorrect,
                  inOrder: answer.inOrder
                }))
              }
            } else if (question.type === QuestionType.trueorfalse) {
              const trueOrFalseQuestion = question as TrueOrFalseQuestion
              return {
                id: trueOrFalseQuestion.id,
                type: trueOrFalseQuestion.type,
                media: trueOrFalseQuestion.media ?? null,
                timeLimit: trueOrFalseQuestion.timeLimit,
                point: trueOrFalseQuestion.point,
                question: trueOrFalseQuestion.question,
                answer: trueOrFalseQuestion.answer,
                inOrder: trueOrFalseQuestion.inOrder
              }
            }
          })
        },
        message: 'Create kahoot successfully'
      })
    } catch (error) {
      logging.error('Create kahoot controller has error', error)
      return next(createError(500))
    }
  })
}

export default createKahootController
