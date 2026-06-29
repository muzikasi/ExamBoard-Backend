import Book from '../models/Book.js'

// @desc Get all books
// @route GET /api/books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 })
    res.json(books)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Get single book by ID
// @route GET /api/books/:id
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }
    res.json(book)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Create a new book
// @route POST /api/books
export const createBook = async (req, res) => {
  try {
    const { title, subject, grade, description, isbn } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a book file' })
    }

    if (!title || !subject || !grade) {
      return res.status(400).json({ message: 'Title, subject, and grade are required' })
    }

    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image'
    const fileUrl = req.file.path || req.file.secure_url || ''

    const book = await Book.create({
      title,
      author: 'minister',
      subject,
      grade,
      description,
      isbn,
      fileUrl,
      fileType
    })

    res.status(201).json(book)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }

    res.status(500).json({ message: error.message })
  }
}

// @desc Update existing book
// @route PUT /api/books/:id
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    const updateData = { ...req.body }
    delete updateData.author

    if (req.file) {
      const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image'
      updateData.fileUrl = req.file.path || req.file.secure_url || ''
      updateData.fileType = fileType
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    })

    res.json(updatedBook)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Delete book
// @route DELETE /api/books/:id
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    await book.deleteOne()
    res.json({ message: 'Book deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
