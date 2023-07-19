import { Router } from 'express'

import KahootController from '~/controllers/kahoot/kahoot.index.controller'

const kahootRouter = Router()

kahootRouter.post('/', KahootController.createKahoot)

export default kahootRouter
