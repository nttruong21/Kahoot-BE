import { Router } from 'express'
import UserController from '../controllers/user/user.index.controller'
import * as middlewares from '../middlewares/index.middleware'

const userRouter = Router()

userRouter.get('/list', UserController.getList)
userRouter.get('/detail/:id', UserController.getDetail)
userRouter.get('/filter', middlewares.validateAccessToken, UserController.filter)
userRouter.put('/', middlewares.validateAccessToken, UserController.update)

export default userRouter
