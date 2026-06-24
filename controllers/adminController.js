import User from '../models/User.js'
import Material from '../models/Material.js'
import fs from 'fs'

// @desc Get all users
// @route GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Delete user
// @route DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' })
    }

    await user.deleteOne()
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Get all materials
// @route GET /api/admin/materials
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
    res.json(materials)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Delete any material
// @route DELETE /api/admin/materials/:id
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)

    if (!material) {
      return res.status(404).json({ message: 'Material not found' })
    }

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