import { Router } from 'express'

import FavoritesController from '../controllers/favorites/favorites.index.controller'
import * as middlewares from '../middlewares/index.middleware'

const favoritesRouter = Router()

favoritesRouter.get('/', middlewares.validateAccessToken, FavoritesController.get)
favoritesRouter.post('/', middlewares.validateAccessToken, FavoritesController.create)
favoritesRouter.delete('/', middlewares.validateAccessToken, FavoritesController.delete)

export default favoritesRouter
