import filterUsersController from './user.filter.controller'
import getUserDetailController from './user.getDetail.controller'
import getUsersListController from './user.getList.controller'
import updateController from './user.update.controller'

class UserController {
  getList = getUsersListController
  getDetail = getUserDetailController
  filter = filterUsersController
  update = updateController
}

export default new UserController()
