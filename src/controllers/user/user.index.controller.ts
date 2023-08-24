import filterUsersController from './user.filter.controller'
import getUserDetailController from './user.getDetail.controller'
import getUsersListController from './user.getList.controller'

class UserController {
  getList = getUsersListController
  getDetail = getUserDetailController
  filter = filterUsersController
}

export default new UserController()
