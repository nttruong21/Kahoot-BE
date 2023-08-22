import { Application, ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { serve, setup } from 'swagger-ui-express'
import createError from 'http-errors'

import { swaggerDocs } from '../configs/swagger.config'
import authRouter from './auth.route'
import kahootRouter from './kahoot.route'
import favoritesRouter from './favorites.route'
import userRouter from './user.route'
import playRouter from './play.route'
import assignmentRouter from './assignment.route'
import SharedRouter from './shared.route'

const configRoutes = (app: Application) => {
  // Swagger
  app.use('/dacnnt2/api/v1/apis-doc', serve, setup(swaggerDocs))

  // Auth
  app.use('/dacnnt2/api/v1/auth', authRouter)

  // Kahoot
  app.use('/dacnnt2/api/v1/kahoots', kahootRouter)

  // Favorite
  app.use('/dacnnt2/api/v1/favorites', favoritesRouter)

  // User
  app.use('/dacnnt2/api/v1/users', userRouter)

  // Play
  app.use('/dacnnt2/api/v1/plays', playRouter)

  // Assignment
  app.use('/dacnnt2/api/v1/assignments', assignmentRouter)

  // Shared
  app.use('/dacnnt2/api/v1/shared', SharedRouter)

  app.get('/dacnnt2/api/v1', (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Welcome to Kahoot NodeJS APIs'
    })
  })

  // Error routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    return next(createError(404))
  })

  const errorHandler: ErrorRequestHandler = (error, req: Request, res: Response, next: NextFunction) => {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      success: false,
      data: null,
      message: error.message
    })
  }

  app.use(errorHandler)
}

export default configRoutes
