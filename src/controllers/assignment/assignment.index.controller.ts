import createAssignmentController from './assignment.create.controller'
import getAssignmentDetailController from './assignment.getDetail.controller'

class AssignmentController {
  getDetail = getAssignmentDetailController
  create = createAssignmentController
}

export default new AssignmentController()
