import { Router } from 'express'
import AssignmentController from '../controllers/assignment/assignment.index.controller'
import * as middlewares from '../middlewares/index.middleware'

const assignmentRouter = Router()
assignmentRouter.post('/', middlewares.validateAccessToken, AssignmentController.create)

export default assignmentRouter
