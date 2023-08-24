import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import * as userServices from '../../services/user/user.index.service'

const filterUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keyword = req.query.k ? req.query.k.toString().trim() : null
    if (!keyword) {
      return next(createError(400, 'Invalid search keyword'))
    }

    const users = await userServices.filter({ keyword, currentUserId: req.user.id })
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
