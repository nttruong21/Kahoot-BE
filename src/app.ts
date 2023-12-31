import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

import configRoutes from './routes/index.route'

dotenv.config()

const app = express()

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({ limit: '10mb' }))
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb'
  })
)

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:4200') // Adjust the origin accordingly
//   res.header('Access-Control-Allow-Credentials', 'true')
//   next()
// })

// app.use((req, res, next) => {
//   setTimeout(() => {
//     next()
//   }, 2000)
// })

// Routes
configRoutes(app)

export default app
