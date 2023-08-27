import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Response {
  id: number
  username: string
  image: string
  numberOfKahoots: number
}

const getUserDetail = async ({ userId }: { userId: number }) => {
  try {
    const query = `
      SELECT users.id, users.username, users.image, COUNT(kahoots.id) as numberOfKahoots 
      FROM users 
      LEFT JOIN kahoots ON kahoots.user_id = users.id 
      WHERE users.id = ?
      `
    const params = [userId]
    const response = await executeQuery<Response[]>(query, params)
    return response ? response[0] : null
  } catch (error) {
    logging.error('Get users list service has error:', error)
    throw error
  }
}
export default getUserDetail
