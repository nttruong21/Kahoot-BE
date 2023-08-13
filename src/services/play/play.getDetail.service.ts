import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Args {
  playId: number
  kahootId?: number
  assignmentId?: number
}

interface Response {
  id: number
  kahootId: number
  point: number
  title: string
  coverImage: string
}

const getPlayDetailService = async ({ playId, kahootId, assignmentId }: Args): Promise<Response | null> => {
  try {
    if (kahootId) {
      const query = `
        SELECT plays.id, plays.kahoot_id AS kahootId, plays.point, kahoots.title, kahoots.cover_image AS coverImage
        FROM plays, kahoots
        WHERE plays.id = ? AND kahoot_id = ? AND plays.kahoot_id = kahoots.id
      `
      const params = [playId, kahootId]
      const response = await executeQuery<Response[]>(query, params)
      return response ? response[0] : null
    }

    if (assignmentId) {
      const query = `
        SELECT plays.id, plays.kahoot_id AS kahootId, plays.point, kahoots.title, kahoots.cover_image AS coverImage
        FROM plays, kahoots, assignments
        WHERE plays.id = ? AND plays.assignment_id = ? AND plays.assignment_id = assignments.id AND assignments.kahoot_id = kahoots.id
        LIMIT 1
      `
      const params = [playId, assignmentId]
      const response = await executeQuery<Response[]>(query, params)
      return response ? response[0] : null
    }

    return null
  } catch (error) {
    logging.error('Get play detail service has error:', error)
    throw error
  }
}
export default getPlayDetailService
