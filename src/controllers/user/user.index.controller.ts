import getUserDetailController from './user.getDetail.controller'
import getUsersListController from './user.getList.controller'

class UserController {
  getList = getUsersListController
  getDetail = getUserDetailController
}

export default new UserController()
