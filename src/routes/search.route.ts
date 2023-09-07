import { Router } from 'express'
import SearchController from '../controllers/search/search.index.controller'
import * as middlewares from '../middlewares/index.middleware'

const searchRouter = Router()

searchRouter.get('/', middlewares.verifyUser, SearchController.search)

export default searchRouter
