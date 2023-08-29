import { Router } from 'express'
import SearchController from '../controllers/search/search.index.controller'

const searchRouter = Router()

searchRouter.get('/', SearchController.search)

export default searchRouter
