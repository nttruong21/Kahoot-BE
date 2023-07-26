import createKahootController from './createKahoot/kahoot.createKahoot.controller'
import getKahootDetailController from './getKahootDetail/kahoot.getKahootDetail.controller'
import updateKahootController from './updateKahoot/kahoot.updateKahoot.controller'

class KahootController {
  createKahoot = createKahootController
  getKahootDetail = getKahootDetailController
  updateKahoot = updateKahootController
}

export default new KahootController()
