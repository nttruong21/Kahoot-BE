import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { Kahoot } from '../../models/kahoot.model'

const getKahootByIdService = async (kahootId: number) => {
  try {
    const query =
      'SELECT id, user_id as userId, cover_image as coverImage, title, theme, description, media, visible_scope as visibleScope FROM kahoots WHERE id = ? LIMIT 1'
    const params = [kahootId]
    const response = await executeQuery<Kahoot[]>(query, params)
    return response[0] ?? null
  } catch (error) {
    logging.error('Get kahoot by id service has error', error)
    throw error
  }
}

export default getKahootByIdService
