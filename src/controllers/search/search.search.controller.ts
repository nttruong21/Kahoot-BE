import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import * as searchServices from '../../services/search/search.index.service'
import { VisibleScope } from '../../enums/kahoot.enum'

const searchController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchKey = req.query.k ? req.query.k.toString().trim() : null
    const page = req.query['page'] ? +req.query['page'] : 1
    const limit = req.query['limit'] ? +req.query['limit'] : 999
    if (!searchKey) {
      return next(createError(400, 'Invalid search key'))
    }

    // Get users which has username that contains search key
    const users = await searchServices.searchUsers({
      limit,
      offset: (page - 1) * limit,
      searchKey,
      sessionUserId: req.user && req.user.id ? req.user.id : null
    })
    if (!users) {
      return next(createError(500, 'Search users failure'))
    }

    // Get kahoots which has title or description that contains search key
    const kahoots = await searchServices.searchKahoots({
      searchKey,
      visibleScope: VisibleScope.public,
      limit,
      offset: (page - 1) * limit,
      sessionUserId: req.user && req.user.id ? req.user.id : null
    })
    if (!kahoots) {
      return next(createError(500, 'Search kahoots failure'))
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        users,
        kahoots
      },
      message: 'Search successfully'
    })
  } catch (error) {
    logging.error('Search controller has error:', error)
    return next(createError(500, 'Search failure'))
  }
}

export default searchController
