import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface User {
  id: number
  username: string
  name: string
  image: string
}

const filterUsersService = async ({
  keyword,
  currentUserId,
  limit,
  offset
}: {
  keyword: string
  currentUserId: number
  limit: number
  offset: number
}) => {
  try {
    const query = 'SELECT id, username, name, image FROM users WHERE username LIKE (?) AND id != ? LIMIT ? OFFSET ?'
    const params = [`%${keyword}%`, currentUserId, limit, offset]
    const response = await executeQuery<User[]>(query, params)
    return response ? response : null
  } catch (error) {
    logging.error('Filter users service has error:', error)
    throw error
  }
}

export default filterUsersService
