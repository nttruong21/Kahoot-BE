import { Router } from 'express'
import SharedController from '../controllers/shared/shared.index.controller'
import * as middlewares from '../middlewares/index.middleware'

const sharedRouter = Router()
sharedRouter.post('/', middlewares.validateAccessToken, SharedController.share)

export default sharedRouter
