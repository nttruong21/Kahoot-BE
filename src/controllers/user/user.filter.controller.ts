import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import * as userServices from '../../services/user/user.index.service'

const filterUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keyword = req.query.k ? req.query.k.toString().trim().toLowerCase() : null
    const page = req.query['page'] ? +req.query['page'] : 1
    const limit = req.query['limit'] ? +req.query['limit'] : 999

    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
      return next(createError(400, 'Invalid page or limit value'))
    }
    if (!keyword) {
      return next(createError(400, 'Invalid search keyword'))
    }

    const users = await userServices.filter({ keyword, currentUserId: req.user.id, limit, offset: (page - 1) * limit })
    if (!users) {
      return next(createError(500, 'Filter users failure'))
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: users,
      message: 'Filter users successfully'
    })
  } catch (error) {
    logging.error('Filter users controller has error:', error)
    return
  }
}

export default filterUsersController
