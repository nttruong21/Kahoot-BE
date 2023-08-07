import { Router } from 'express'
import UserController from '../controllers/user/user.index.controller'

const userRouter = Router()

userRouter.get('/list', UserController.getList)
userRouter.get('/detail/:id', UserController.getDetail)

export default userRouter
