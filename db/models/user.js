import { Schema, model, models } from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 200
  },
  zodiac: {
    type: String,
    required: true
  },
  likedTracks: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date, default: Date.now
  },
  updatedAt: {
    type: Date, default: Date.now
  }
})

// hashes the password before it's stored in mongo
UserSchema.pre('save', async function (next) {
  if (this.isNew)
    this.password = await bcrypt.hash(this.password, 10)
  next()
})

export default models.User || model('User', UserSchema)