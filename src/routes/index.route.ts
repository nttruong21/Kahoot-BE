import { Application, ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { serve, setup } from 'swagger-ui-express'
import createError from 'http-errors'

import authRouter from './auth.route'
import { swaggerDocs } from '~/configs/swagger.config'

const configRoutes = (app: Application) => {
  // Swagger
  app.use('/api/v1/apis-doc', serve, setup(swaggerDocs))

  // Auth
  app.use('/api/v1/auth', authRouter)

  // Error routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    return next(createError(404))
  })

  const errorHandler: ErrorRequestHandler = (error, req: Request, res: Response, next: NextFunction) => {
    return res.status(error.status || 500).json({
      code: error.status || 500,
      success: false,
      data: {},
      message: error.message
    })
  }

  app.use(errorHandler)
}

export default configRoutes
