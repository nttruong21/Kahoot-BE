import { createClient } from 'redis'

import logging from '../utils/logging.util'

const client = createClient()

client.on('error', (err) => logging.error(`[Redis] Connect to redis failure: ${err}`))

client.on('connect', (err) => logging.success('[Redis] Connect to redis successfully'))

client.on('ready', (err) => logging.success(`[Redis] Redis is ready on 127.0.0.1:6379`))

client.on('disconnect', () => logging.warning('[Redis] Redis disconnected'))

// client.get = util.promisify(client.get)

export default client
