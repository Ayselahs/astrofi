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
