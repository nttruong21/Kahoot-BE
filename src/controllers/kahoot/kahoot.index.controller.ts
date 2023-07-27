import createKahootController from './createKahoot/kahoot.createKahoot.controller'
import deleteKahootController from './deleteKahoot/kahoot.deleteKahoot.controller'
import getKahootDetailController from './getKahootDetail/kahoot.getKahootDetail.controller'
import getKahootsListController from './getKahootsList/kahoot.getKahootsList.controller'
import updateKahootController from './updateKahoot/kahoot.updateKahoot.controller'

class KahootController {
  getKahootsList = getKahootsListController
  getKahootDetail = getKahootDetailController
  createKahoot = createKahootController
  updateKahoot = updateKahootController
  deleteKahoot = deleteKahootController
}

export default new KahootController()
