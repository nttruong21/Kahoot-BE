import createPlayController from './play.create.controller'
import getPlayDetailController from './play.getDetail.controller'
import getPlaysListController from './play.getList.controller'

class PlayController {
  create = createPlayController
  getList = getPlaysListController
  getDetail = getPlayDetailController
}

export default new PlayController()
