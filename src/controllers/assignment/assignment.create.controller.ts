import { Request, Response, NextFunction } from 'express'
import otpGenerator from 'otp-generator'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import * as assignmentServices from '../../services/assignment/assignment.index.service'

interface RequestBody {
  kahootId: number
  expiredAt: number
}

const createAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { kahootId, expiredAt } = req.body as RequestBody
    if (!Number.isInteger(kahootId) || kahootId < 0 || !Number.isInteger(expiredAt) || expiredAt < 0) {
      return next(createError(400, 'Invalid parameter'))
    }

    // Generate pin
    const pin = otpGenerator.generate(8, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    })

    const createAssignmentResponse = await assignmentServices.create({ userId: req.user.id, kahootId, pin, expiredAt })
    if (!createAssignmentResponse) {
      return next(createError(500, 'Create assignment service has error'))
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        id: createAssignmentResponse,
        pin,
        kahootId,
        expiredAt
      },
      message: 'Create assignment successfully'
    })
  } catch (error) {
    logging.error('Create assignment controller has error:', error)
    return next(createError(500, 'Create assignment failure'))
  }
}

export default createAssignmentController
