import { Router } from 'express'
import PlayController from '../controllers/play/play.index.controller'
import * as middlewares from '../middlewares/index.middleware'

const playRouter = Router()

playRouter.get('/', middlewares.validateAccessToken, PlayController.getList)
playRouter.get('/top-players', middlewares.validateAccessToken, PlayController.getTopPlayers)
playRouter.get('/:id', middlewares.validateAccessToken, PlayController.getDetail)
playRouter.post('/', middlewares.validateAccessToken, PlayController.create)

export default playRouter
