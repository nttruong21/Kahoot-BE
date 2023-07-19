import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import app from './app'
import logging from './utils/logging.util'
import redisClient from './configs/redis.config'
import * as databaseConfigs from './configs/database.config'
const server = http.createServer(app)

// Connect MariaDB
databaseConfigs
  .getConnection()
  .then(async () => {
    // Connect to redis server
    await redisClient.connect()

    // Start server
    server.listen(+process.env.PORT! || 5000, () => {
      logging.success('[Server] Server start successfully')
    })
  })
  .catch(async (error) => {
    try {
      await redisClient.disconnect()
      server.close(() => {
        logging.warning('[Server] Server closed', error)
      })
    } catch (error) {
      logging.error('Error', error)
    }
  })
