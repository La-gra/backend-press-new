import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import path from 'path'

import routes from './routes'
import rssRoutes from './routes/rss.routes'


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
  process.env.FRONTEND_URL,
]

const app = express()
app.use(express.static(path.join(__dirname, '../public')))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("CORS blocked"))
      }
    },
    credentials: true,
  })
)
app.use(cookieParser())

app.use(helmet())

app.use(express.json())

// Public RSS/Sitemap routes (no auth required)
app.use('/', rssRoutes)

app.use('/api/v1', routes)

export default app