import { Request, Response, NextFunction } from 'express'
import validator from 'validator'
import createError from 'http-errors'

import { QuestionPoint, QuestionType, Theme, VisibleScope } from '~/enums/kahoot.enum'
import { Kahoot } from '~/models/kahoot.model'

const validateCreatingKahootFormDataController = (
  req: Request,
  res: Response,
  next: NextFunction,
  kahootBodyData: Kahoot
) => {
  const { userId, coverImage, title, theme, description, media, language, visibleScope, questions } = kahootBodyData

  // Required fields: userId, title, theme, visibleScope, questions
  // User id
  if (!userId || !Number.isInteger(userId) || userId < 1) {
    return next(createError(400, 'Invalid user id'))
  }

  // Title
  if (!title || validator.isEmpty(title.trim())) {
    return next(createError(400, 'Invalid title'))
  }

  // Theme
  if (!theme || validator.isEmpty(theme) || !(theme in Theme)) {
    return next(createError(400, 'Invalid theme'))
  }

  // Visible scope
  if (!visibleScope || validator.isEmpty(visibleScope) || !(visibleScope in VisibleScope)) {
    return next(createError(400, 'Invalid visible scope'))
  }

  // Questions
  if (!Array.isArray(questions) || questions.length < 1) {
    return next(createError(400, 'Invalid questions'))
  }
  let isInvalidQuestion = false
  let invalidQuestionMessage: string | null = null
  questions.map((question) => {
    if (isInvalidQuestion) {
      return
    }

    // Question type
    if (!question.type || validator.isEmpty(question.type) || !(question.type in QuestionType)) {
      isInvalidQuestion = true
      invalidQuestionMessage = 'Invalid question type'
      return
    }

    // Question time limit
    if (!question.point || !Number.isInteger(question.point) || question.timeLimit < 10) {
      isInvalidQuestion = true
      invalidQuestionMessage = 'Invalid question time limit'
      return
    }

    // Question point
    if (!question.point || !Number.isInteger(question.point) || !(question.point in QuestionPoint)) {
      isInvalidQuestion = true
      invalidQuestionMessage = 'Invalid question point'
      return
    }

    // Question text
    if (!question.question || validator.isEmpty(question.question.trim())) {
      isInvalidQuestion = true
      invalidQuestionMessage = 'Invalid question text'
      return
    }

    // Question answers
    if (!Array.isArray(question.answers) || question.answers.length < 1) {
      isInvalidQuestion = true
      invalidQuestionMessage = 'Invalid question answers'
      return
    }

    question.answers.map((answer) => {
      if (isInvalidQuestion) {
        return
      }

      if ((!answer.text && !answer.image) || typeof answer.isCorrect !== 'boolean') {
        isInvalidQuestion = true
        invalidQuestionMessage = 'Invalid answer'
        return
      }
    })
  })

  if (isInvalidQuestion) {
    return next(createError(400, invalidQuestionMessage!))
  }
}

export default validateCreatingKahootFormDataController
