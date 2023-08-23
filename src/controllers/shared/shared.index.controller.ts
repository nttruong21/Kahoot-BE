import getSharedKahootsController from './shared.get.controller'
import shareKahootController from './shared.share.controller'

class SharedController {
  get = getSharedKahootsController
  share = shareKahootController
}

export default new SharedController()
