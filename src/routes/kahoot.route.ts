import { Router } from 'express'

import KahootController from '../controllers/kahoot/kahoot.index.controller'
import * as middlewares from '../middlewares/index.middleware'

const kahootRouter = Router()

kahootRouter.get('/detail/:id', KahootController.getKahootDetail)
kahootRouter.post('/', middlewares.validateAccessToken, KahootController.createKahoot)
kahootRouter.put('/', middlewares.validateAccessToken, KahootController.updateKahoot)

export default kahootRouter
