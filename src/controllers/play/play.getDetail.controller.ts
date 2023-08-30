import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../utils/logging.util'
import { QuestionType } from '../../enums/kahoot.enum'
import * as playServices from '../../services/play/play.index.service'
import * as kahootServices from '../../services/kahoot/kahoot.index.service'
import * as questionServices from '../../services/question/question.index.service'
import * as answerServices from '../../services/answer/answer.index.service'

const getPlayDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playId = req.params['id'] ? +req.params['id'] : undefined
    const kahootId = req.query['kahootId'] ? +req.query['kahootId'] : undefined
    const assignmentId = req.query['assignmentId'] ? +req.query['assignmentId'] : undefined

    // Validation
    if (!playId || !Number.isInteger(playId) || playId! < 1) {
      return next(createError(400, 'Invalid play id'))
    }
    if ((!kahootId && !assignmentId) || (!Number.isInteger(kahootId) && !Number.isInteger(assignmentId))) {
      return next(createError(400, 'Must be has one of both value: kahoot id | assignment id'))
    }
    if (kahootId && !Number.isInteger(kahootId)) {
      return next(createError(400, 'Invalid kahoot id'))
    }
    if (assignmentId && !Number.isInteger(assignmentId)) {
      return next(createError(400, 'Invalid assignment id'))
    }

    // Get play detail
    const play = await playServices.getDetail({
      playId,
      kahootId,
      assignmentId
    })
    if (!play) {
      return next(createError(500, 'Get play detail failure'))
    }

    // Get questions by kahoot id
    const questions = await questionServices.getQuestions({ kahootId: play.kahootId })
    if (!questions || questions.length === 0) {
      return next(createError(500))
    }

    // Get user answers by play id
    const userAnswers = await playServices.getAnswers({
      playId
    })
    if (!userAnswers) {
      return next(createError(500, 'Get user answers failure'))
    }
    if (questions.length !== userAnswers.length) {
      return next(createError(500, 'Number of questions and number of user answers is not equal'))
    }

    // Get correct answer of each question
    const questionsWithCorrectAnswer: any[] = []
    await Promise.all(
      questions.map(async (question, index) => {
        if (question.type === QuestionType.quiz) {
          // Get correct answer
          const correctAnswer = await answerServices.getCorrectAnswerOfQuizQuestion({
            questionId: question.id!
          })
          if (!correctAnswer) {
            return next(createError(500, 'Get correct answer of quiz question failure'))
          }

          questionsWithCorrectAnswer.push({
            type: question.type,
            inOrder: question.inOrder,
            media: question.media,
            question: question.question,
            point: question.point,
            userAnswer: {
              id: userAnswers[index].answerId,
              text: userAnswers[index].text,
              image: userAnswers[index].image
            },
            correctAnswer: {
              id: correctAnswer.id,
              text: correctAnswer.text,
              image: correctAnswer.image
            },
            isCorrect: userAnswers[index].answerId === correctAnswer.id
          })
        } else if (question.type === QuestionType.trueorfalse) {
          questionsWithCorrectAnswer.push({
            type: question.type,
            inOrder: question.inOrder,
            media: question.media,
            question: question.question,
            point: question.point,
            userAnswer: userAnswers[index].tfAnswer,
            correctAnswer: question.answer,
            isCorrect: question.answer === userAnswers[index].tfAnswer
          })
        }
      })
    )

    // If this is assignment, get top 5 users
    let topPlayers = null
    if (assignmentId) {
      topPlayers = await playServices.getTopPlayers({ assignmentId, limit: 5 })
      if (!topPlayers) {
        return next(createError(500, 'Get top players failure'))
      }
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        ...play,
        assignmentId,
        answers: questionsWithCorrectAnswer.sort((a, b) => (a['inOrder'] as number) - (b['inOrder'] as number)),
        topPlayers
      },
      message: 'Get play detail successfully'
    })
  } catch (error) {
    logging.error('Get play detail controller has error:', error)
    throw error
  }
}

export default getPlayDetailController
