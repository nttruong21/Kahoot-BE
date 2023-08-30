import createPlayController from './play.create.controller'
import getPlayDetailController from './play.getDetail.controller'
import getPlaysListController from './play.getList.controller'
import getTopPlayersController from './play.getTopPlayers.controller'

class PlayController {
  create = createPlayController
  getList = getPlaysListController
  getDetail = getPlayDetailController
  getTopPlayers = getTopPlayersController
}

export default new PlayController()
