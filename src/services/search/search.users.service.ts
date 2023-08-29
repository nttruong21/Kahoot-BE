import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface User {
  id: number
  username: string
  name: string
  image: string
}

const searchUsersService = async ({
  searchKey,
  sessionUserId,
  limit,
  offset
}: {
  searchKey: string
  sessionUserId: number | null
  limit: number
  offset: number
}) => {
  try {
    const query = 'SELECT id, username, name, image FROM users WHERE username LIKE (?) AND id != ? LIMIT ? OFFSET ?'
    const params = [`%${searchKey}%`, sessionUserId ?? -1, limit, offset]
    const response = await executeQuery<User[]>(query, params)
    return response ? response : null
  } catch (error) {
    logging.error('Search users service has error:', error)
    throw error
  }
}

export default searchUsersService
