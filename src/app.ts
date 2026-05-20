import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import path from 'path'

import routes from './routes'

const app = express()
app.use(express.static(path.join(__dirname, '../public')))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)

app.use(cookieParser())

app.use(helmet())

app.use(express.json())

app.use('/api/v1', routes)

export default app