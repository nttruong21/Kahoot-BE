import createAssignmentController from './assignment.create.controller'
import getAssignmentDetailController from './assignment.getDetail.controller'
import getAssignmentsListController from './assignment.getList.controller'

class AssignmentController {
  getList = getAssignmentsListController
  getDetail = getAssignmentDetailController
  create = createAssignmentController
}

export default new AssignmentController()
