import mongoose from 'mongoose'

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  subject: {
    type: String,
    required: true,
    trim: true
  },

  year: {
    ec: {
      type: Number,
      required: function() {
        return this.type === 'Past exam question'
      }
    },
    gc: {
      type: Number,
      required: function() {
        return this.type === 'Past exam question'
      }
    }
  },

  grade: {
    type: String,
    enum: ['grade 9', 'grade 10', 'grade 11', 'grade 12', 'university student'],
    required: function() {
      return this.type === 'Past exam question'
    }
  },

  type: {
    type: String,
    enum: ['Past exam question', 'Summary notes', 'Study tips'],
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  fileType: {
    type: String,
    enum: ['pdf', 'image'],
    required: true
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

}, { timestamps: true })

export default mongoose.model('Material', materialSchema)