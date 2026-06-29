import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Material from '../../models/Material.js'

dotenv.config()

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    const result = await Material.updateMany(
      { type: { $in: ['Study tips', 'Summary notes'] } },
      {
        $set: {
          grade: null,
          'year.ec': null,
          'year.gc': null
        }
      }
    )

    console.log(`Migration complete. Modified ${result.modifiedCount} documents.`)
  } catch (error) {
    console.error('Migration error:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

migrate()
