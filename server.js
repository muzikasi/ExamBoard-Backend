import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import multer from 'multer'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import materialRoutes from './routes/materials.js'
import bookmarkRoutes from './routes/bookmarks.js'
import adminRoutes from './routes/admin.js'
import booksRouter from './routes/books.js'

dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB()

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Books router (API) — mounted after JSON and CORS middleware
app.use('/api/books', booksRouter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/materials', materialRoutes)
app.use('/api/bookmarks', bookmarkRoutes)
app.use('/api/admin', adminRoutes)

// Global error handler for multer and file upload issues
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max size is 50MB.' })
    }
    return res.status(400).json({ message: err.message })
  }

  if (err && err.message === 'Only PDF and image files are allowed!') {
    return res.status(400).json({ message: err.message })
  }

  if (err) {
    return res.status(500).json({ message: err.message || 'Server error' })
  }

  next()
})

app.get('/', (req, res) => {
  res.json({ message: 'Exam Prep Board API is running!' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})