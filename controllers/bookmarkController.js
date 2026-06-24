import Bookmark from '../models/Bookmark.js'
import Material from '../models/Material.js'

// @desc Get user bookmarks
// @route GET /api/bookmarks
export const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'material',
        populate: { path: 'uploadedBy', select: 'name email' }
      })
      .sort({ createdAt: -1 })

    res.json(bookmarks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Add bookmark
// @route POST /api/bookmarks/:id
export const addBookmark = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
    if (!material) {
      return res.status(404).json({ message: 'Material not found' })
    }

    const alreadyBookmarked = await Bookmark.findOne({
      user: req.user._id,
      material: req.params.id
    })

    if (alreadyBookmarked) {
      return res.status(400).json({ message: 'Material already bookmarked' })
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      material: req.params.id
    })

    res.status(201).json(bookmark)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Remove bookmark
// @route DELETE /api/bookmarks/:id
export const removeBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      material: req.params.id
    })

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' })
    }

    res.json({ message: 'Bookmark removed successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}