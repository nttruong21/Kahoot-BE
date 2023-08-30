import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import * as assignmentServices from '../../services/assignment/assignment.index.service'

const getAssignmentsListController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query['page'] ? +req.query['page'] : 1
    const limit = req.query['limit'] ? +req.query['limit'] : 999

    const assignments = await assignmentServices.getList({
      sessionUserId: req.user.id,
      page,
      offset: (page - 1) * limit
    })
    if (!assignments) {
      return next(createError(500, 'Get assignments list failure'))
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: assignments,
      message: 'Get assignments list successfully'
    })
  } catch (error) {
    logging.error('Get assignments list controller has error:', error)
    return next(createError(500, 'Get assignments list failure'))
  }
}

export default getAssignmentsListController
