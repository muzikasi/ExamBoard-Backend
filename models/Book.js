import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true,
    default: 'minister'
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    enum: ['grade 9', 'grade 10', 'grade 11', 'grade 12', 'university student'],
    required: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  isbn: {
    type: String,
    trim: true,
    default: ''
  },

  fileUrl: {
    type: String,
    required: true
  },

  fileType: {
    type: String,
    enum: ['pdf', 'image'],
    required: true
  }
}, { timestamps: true })

export default mongoose.model('Book', bookSchema)
