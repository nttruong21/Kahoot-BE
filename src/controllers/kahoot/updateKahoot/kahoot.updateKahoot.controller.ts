import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../../utils/logging.util'
import myFormidable from '../../../configs/formidable.config'
import validateCreatingKahootFormDataController from '../createKahoot/kahoot.validateCreatingKahootFormData.controller'
import { Kahoot, QuizQuestion, TrueOrFalseQuestion } from '../../../models/kahoot.model'
import { uploadImage } from '../../../configs/firebaseUpload.config'
import { QuestionType } from '../../../enums/kahoot.enum'
import * as kahootServices from '../../../services/kahoot/kahoot.index.service'
import * as questionServices from '../../../services/question/question.index.service'
import * as answerServices from '../../../services/answer/answer.index.service'

const updateKahootController = (req: Request, res: Response, next: NextFunction) => {
  try {
    myFormidable.parse(req, async (err, fields, files) => {
      if (err) {
        logging.error('Form parser has error', err)
        return next(createError(500))
      }

      // Get body data
      const kahootBodyData = fields['kahoot'] ? JSON.parse(fields['kahoot'][0]) : null
      const deletedQuestionIds: number[] = fields['deletedQuestionIds']
        ? JSON.parse(fields['deletedQuestionIds'][0])
        : []
      const deletedAnswerIds: number[] = fields['deletedAnswerIds'] ? JSON.parse(fields['deletedAnswerIds'][0]) : []
      const kahootBodyDataConverted = kahootBodyData as Kahoot

      // Validate kahoot body
      if (!kahootBodyDataConverted.id || !Number.isInteger(kahootBodyDataConverted.id)) {
        return next(createError(400, 'Invalid kahoot id'))
      }

      let invalidId = false
      kahootBodyDataConverted.questions.map((question, questionIndex) => {
        if (invalidId) {
          return
        }
        const flag: string | undefined = kahootBodyData['questions'][questionIndex]['flag']
        if (flag && flag === 'edited' && !question.id) {
          invalidId = true
          return
        }
        if (question.type === QuestionType.quiz) {
          question.answers?.map((answer, answerIndex) => {
            if (invalidId) {
              return
            }
            const flag: string | undefined = kahootBodyData['questions'][questionIndex]['answers'][answerIndex]['flag']
            if (flag && flag === 'edited' && !answer.id) {
              invalidId = true
              return
            }
          })
        }
      })
      if (invalidId) {
        return next(createError(400))
      }

      invalidId = deletedQuestionIds.findIndex((questionId) => !Number.isInteger(questionId)) >= 0
      if (invalidId) {
        return next(createError(400, 'Invalid deleted question id'))
      }

      invalidId = deletedAnswerIds.findIndex((answerId) => !Number.isInteger(answerId)) >= 0
      if (invalidId) {
        return next(createError(400, 'Invalid deleted answer id'))
      }

      const validateError = validateCreatingKahootFormDataController(kahootBodyDataConverted)
      if (validateError) {
        return next(createError(400, validateError))
      }

      // Check kahoot is existed?
      const kahoot = await kahootServices.getKahoot({ kahootId: kahootBodyDataConverted.id, userId: req.user.id })
      if (!kahoot) {
        return next(createError(400))
      }

      // Check kahoot flag
      if (kahootBodyData['flag'] === 'edited') {
        // Update kahoot
        if (!kahootBodyDataConverted.coverImage.startsWith('https')) {
          kahootBodyDataConverted.coverImage = await uploadImage(kahootBodyDataConverted.coverImage)
        }
        await kahootServices.updateKahoot(kahootBodyDataConverted)
      }

      // Handle questions
      await Promise.all(
        kahootBodyDataConverted.questions.map(async (question, questionIndex) => {
          const flag: string | undefined = kahootBodyData['questions'][questionIndex]['flag']
          if (flag === 'added') {
            // Create question
            if (question.type === QuestionType.quiz) {
              const quizQuestion = question as QuizQuestion
              quizQuestion.inOrder = questionIndex + 1
              if (quizQuestion.media) {
                quizQuestion.media = await uploadImage(quizQuestion.media)
              }
              const questionCreatedId = await questionServices.createQuizQuestion(
                kahootBodyDataConverted.id!,
                quizQuestion
              )
              if (!questionCreatedId) {
                return next(createError(500, 'Create question failure'))
              }
              quizQuestion.id = questionCreatedId

              // Create answers
              await Promise.all(
                quizQuestion.answers.map(async (answer, answerIndex) => {
                  answer.inOrder = answerIndex + 1
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
              trueOrFalseQuestion.inOrder = questionIndex + 1
              if (trueOrFalseQuestion.media) {
                trueOrFalseQuestion.media = await uploadImage(trueOrFalseQuestion.media)
              }
              const questionCreatedId = await questionServices.createTrueOrFalseQuestion(
                kahootBodyDataConverted.id!,
                trueOrFalseQuestion
              )
              if (!questionCreatedId) {
                return next(createError(500, 'Create question failure'))
              }
              trueOrFalseQuestion.id = questionCreatedId
            }
          } else {
            if (flag === 'edited') {
              // Update question
              if (question.type === QuestionType.quiz) {
                const quizQuestion = question as QuizQuestion
                quizQuestion.inOrder = questionIndex + 1
                if (quizQuestion.media && !quizQuestion.media.startsWith('https')) {
                  quizQuestion.media = await uploadImage(quizQuestion.media)
                }
                await questionServices.updateQuizQuestion(quizQuestion)
              } else if (question.type === QuestionType.trueorfalse) {
                const trueOrFalseQuestion = question as TrueOrFalseQuestion
                trueOrFalseQuestion.inOrder = questionIndex + 1
                if (trueOrFalseQuestion.media && !trueOrFalseQuestion.media.startsWith('https')) {
                  trueOrFalseQuestion.media = await uploadImage(trueOrFalseQuestion.media)
                }
                await questionServices.updateTrueOrFalseQuestion(trueOrFalseQuestion)
              }
            }

            // Handle answers
            if (question.type === QuestionType.quiz) {
              const quizQuestion = question as QuizQuestion

              await Promise.all(
                quizQuestion.answers.map(async (answer, answerIndex) => {
                  const flag: string | undefined =
                    kahootBodyData['questions'][questionIndex]['answers'][answerIndex]['flag']
                  switch (flag) {
                    case 'added':
                      // Create answer
                      answer.inOrder = answerIndex + 1
                      if (answer.image) {
                        answer.image = await uploadImage(answer.image)
                      }
                      const answerIdCreated = await answerServices.createAnswer(quizQuestion.id!, answer)
                      if (!answerIdCreated) {
                        return next(createError(500))
                      }
                      break
                    case 'edited':
                      // Update answer
                      answer.inOrder = answerIndex + 1
                      if (answer.image && !answer.image.startsWith('https')) {
                        answer.image = await uploadImage(answer.image)
                      }
                      await answerServices.updateAnswer(answer)
                      break
                    default:
                      break
                  }
                })
              )
            }
          }
        })
      )

      // Handle delete questions, answers
      if (deletedAnswerIds.length > 0) {
        await answerServices.deleteAnswers({ answerIds: deletedAnswerIds })
      }
      if (deletedQuestionIds.length > 0) {
        await questionServices.deleteQuestions({ questionsIds: deletedQuestionIds })
      }

      return res.status(200).json({
        code: 200,
        success: true,
        data: {},
        message: 'Update kahoot successfully'
      })
    })
  } catch (error) {
    logging.error('Update kahoot controller has error', error)
    return next(createError(500))
  }
}

export default updateKahootController
