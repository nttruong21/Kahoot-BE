import { executeQuery } from '../../configs/database.config'
import { VisibleScope } from '../../enums/kahoot.enum'
import { KahootSummary } from '../../types/kahoot.type'
import logging from '../../utils/logging.util'

const searchKahootsService = async ({
  searchKey,
  visibleScope,
  sessionUserId,
  limit,
  offset
}: {
  searchKey: string
  visibleScope: VisibleScope
  sessionUserId: number | null
  limit: number
  offset: number
}) => {
  try {
    const query = `
      SELECT kahoots.id, kahoots.cover_image AS coverImage, kahoots.title, kahoots.created_at as createdAt, kahoots.visible_scope as visibleScope, kahoots.user_id as userId, users.username, users.image as userImage, COUNT(questions.id) AS numberOfQuestion
      FROM questions
      LEFT JOIN (users, kahoots) ON (kahoots.visible_scope = ? AND kahoots.user_id = users.id AND kahoots.user_id != ? AND (kahoots.title LIKE ? OR kahoots.description LIKE ?))
      WHERE questions.kahoot_id = kahoots.id 
      GROUP BY kahoots.id
      LIMIT ? OFFSET ?
      `
    const params = [visibleScope, sessionUserId ?? -1, `%${searchKey}%`, `%${searchKey}%`, limit, offset]
    const response = await executeQuery<KahootSummary[]>(query, params)
    return response
      ? response.map((kahoot) => ({
          ...kahoot,
          createdAt: new Date(kahoot.createdAt).getTime(),
          numberOfQuestion: Number(kahoot.numberOfQuestion)
        }))
      : null
  } catch (error) {
    logging.error('Search users service has error:', error)
    throw error
  }
}

export default searchKahootsService
