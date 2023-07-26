import createKahootController from './createKahoot/kahoot.createKahoot.controller'
import getKahootDetailController from './getKahootDetail/kahoot.getKahootDetail.controller'

class KahootController {
  createKahoot = createKahootController
  getKahootDetail = getKahootDetailController
}

export default new KahootController()
