import Material from '../models/Material.js'
import fs from 'fs'

// @desc Get all materials (with search and filter)
// @route GET /api/materials
export const getMaterials = async (req, res) => {
  try {
    const { search, subject, year } = req.query

    let query = {}

    if (search) {
      query.title = { $regex: search, $options: 'i' }
    }
    if (subject) {
      query.subject = subject
    }
    if (year) {
      query.year = year
    }

    const materials = await Material.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })

    res.json(materials)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Get single material
// @route GET /api/materials/:id
export const getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('uploadedBy', 'name email')

    if (!material) {
      return res.status(404).json({ message: 'Material not found' })
    }

    res.json(material)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Upload new material
// @route POST /api/materials
export const createMaterial = async (req, res) => {
  try {
    const { title, subject, year, type } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' })
    }

    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image'
    const fileUrl = `/uploads/${req.file.filename}`

    const material = await Material.create({
      title,
      subject,
      year,
      type,
      fileUrl,
      fileType,
      uploadedBy: req.user._id
    })

    res.status(201).json(material)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Update material
// @route PUT /api/materials/:id
export const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)

    if (!material) {
      return res.status(404).json({ message: 'Material not found' })
    }

    if (material.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this material' })
    }

    const updated = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Delete material
// @route DELETE /api/materials/:id
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)

    if (!material) {
      return res.status(404).json({ message: 'Material not found' })
    }

    if (
      material.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this material' })
    }

    // Delete file from uploads folder
    const filePath = `.${material.fileUrl}`
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await material.deleteOne()

    res.json({ message: 'Material deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Upvote material
// @route PUT /api/materials/:id/upvote
export const upvoteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)

    if (!material) {
      return res.status(404).json({ message: 'Material not found' })
    }

    const alreadyUpvoted = material.upvotes.includes(req.user._id)

    if (alreadyUpvoted) {
      // Remove upvote
      material.upvotes = material.upvotes.filter(
        id => id.toString() !== req.user._id.toString()
      )
    } else {
      // Add upvote
      material.upvotes.push(req.user._id)
    }

    await material.save()

    res.json({
      upvotes: material.upvotes.length,
      upvoted: !alreadyUpvoted
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}