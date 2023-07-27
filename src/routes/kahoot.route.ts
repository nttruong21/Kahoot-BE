import { Router } from 'express'

import KahootController from '../controllers/kahoot/kahoot.index.controller'
import * as middlewares from '../middlewares/index.middleware'

const kahootRouter = Router()

kahootRouter.get('/', middlewares.verifyUser, KahootController.getKahootsList)
kahootRouter.get('/detail/:id', KahootController.getKahootDetail)
kahootRouter.post('/', middlewares.validateAccessToken, KahootController.createKahoot)
kahootRouter.put('/', middlewares.validateAccessToken, KahootController.updateKahoot)
kahootRouter.delete('/:id', middlewares.validateAccessToken, KahootController.deleteKahoot)

export default kahootRouter
