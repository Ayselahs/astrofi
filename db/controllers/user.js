import User from '../models/user'
import dbConnect from '../connection'

export async function create(username, password, zodiac) {
  if (!(username && password && zodiac))
    throw new Error('Must include username zodiac, and password')

  await dbConnect()

  const user = await User.create({ username, password, zodiac })

  if (!user)
    throw new Error('Error inserting User')

  return user.toJSON()
}

export async function getUser(req, res) {
  await dbConnect()

  const { id } = req.query

  const user = await User.findById(id)

  if (!user) {
    throw new Error('No User found')
  }
  return { data: user }
}


export async function updateZodiac(req, res) {
  await dbConnect()

  const { userId, zodiac } = req.body
  const user = await User.findByIdAndUpdate(userId, { zodiac }, { new: true })

  if (!user) {
    throw new Error('No User found')
  }

  return { data: user }
}