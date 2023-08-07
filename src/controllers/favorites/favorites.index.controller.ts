import createFavoriteKahootController from './favorites.create.controller'
import deleteFavoriteKahootController from './favorites.delete.controller'
import getFavoriteKahootsController from './favorites.get.controller'

class FavoritesController {
  create = createFavoriteKahootController
  get = getFavoriteKahootsController
  delete = deleteFavoriteKahootController
}

export default new FavoritesController()
