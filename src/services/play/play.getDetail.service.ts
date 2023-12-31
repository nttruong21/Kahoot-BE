import { executeQuery } from '../../configs/database.config'
import { PlayType } from '../../types/play.type'
import logging from '../../utils/logging.util'

interface Args {
  playId?: number
  kahootId?: number
  assignmentId?: number
  userId?: number
}

interface Response {
  id: number
  type: PlayType
  kahootId: number
  point: number
  title: string
  coverImage: string
}

const getPlayDetailService = async ({ playId, kahootId, assignmentId, userId }: Args): Promise<Response | null> => {
  try {
    if (playId && kahootId) {
      const query = `
        SELECT plays.id, plays.kahoot_id AS kahootId, plays.point, kahoots.title, kahoots.cover_image AS coverImage
        FROM plays, kahoots
        WHERE plays.id = ? AND kahoot_id = ? AND plays.kahoot_id = kahoots.id
      `
      const params = [playId, kahootId]
      const response = await executeQuery<Response[]>(query, params)
      return response ? response[0] : null
    }

    if (playId && assignmentId) {
      const query = `
        SELECT plays.id, plays.kahoot_id AS kahootId, plays.point, plays.type, kahoots.title, kahoots.cover_image AS coverImage
        FROM plays, kahoots, assignments
        WHERE plays.id = ? AND plays.assignment_id = ? AND plays.assignment_id = assignments.id AND assignments.kahoot_id = kahoots.id
        LIMIT 1
      `
      const params = [playId, assignmentId]
      const response = await executeQuery<Response[]>(query, params)
      return response ? response[0] : null
    }

    if (userId && assignmentId) {
      const query = `
        SELECT plays.id, plays.kahoot_id AS kahootId, plays.point, kahoots.title, kahoots.cover_image AS coverImage
        FROM plays, kahoots, assignments
        WHERE plays.user_id = ? AND plays.assignment_id = ? AND plays.assignment_id = assignments.id AND assignments.kahoot_id = kahoots.id
        LIMIT 1
      `
      const params = [userId, assignmentId]
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
