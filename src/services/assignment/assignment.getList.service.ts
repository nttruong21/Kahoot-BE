import { executeQuery } from '../../configs/database.config'
import { VisibleScope } from '../../enums/kahoot.enum'
import logging from '../../utils/logging.util'

interface Response {
  id: number
  kahootId: number
  pin: string
  expiredAt: Date
  createdAt: Date
  coverImage: string | null
  title: string
  visibleScope: VisibleScope
  userId: number
  username: string
  userImage: string
  numberOfQuestion: number
}

const getAssignmentsListService = async ({
  sessionUserId,
  page,
  offset
}: {
  sessionUserId: number
  page: number
  offset: number
}) => {
  try {
    const query = `
			SELECT assignments.id, assignments.kahoot_id AS kahootId, assignments.pin, assignments.expired_at AS expiredAt, assignments.created_at as createdAt, kahoots.cover_image AS coverImage, kahoots.title, kahoots.visible_scope as visibleScope, kahoots.user_id as userId, users.username, users.image as userImage, COUNT(questions.id) AS numberOfQuestion
			FROM questions
			LEFT JOIN (users, kahoots, assignments) ON (assignments.user_id = ? AND assignments.kahoot_id = kahoots.id AND kahoots.user_id = users.id) 
			WHERE questions.kahoot_id = kahoots.id
			GROUP BY assignments.id
			LIMIT ? OFFSET ?
			`
    const params = [sessionUserId, page, offset]
    const response = await executeQuery<Response[]>(query, params)
    return response && Array.isArray(response)
      ? response.map((item) => ({
          ...item,
          expiredAt: item.expiredAt.getTime(),
          createdAt: item.createdAt.getTime(),
          numberOfQuestion: parseInt(item.numberOfQuestion.toString())
        }))
      : null
  } catch (error) {
    logging.error('Get assignments list service has error:', error)
    throw error
  }
}

export default getAssignmentsListService
