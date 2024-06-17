import dbConnect from "@/db/connection";
import { create, remove } from '../../db/controllers/genre'

export default async function handler(req, res) {
    await dbConnect()

    switch (req.method) {
        case 'POST':
            return create(req, res)
        case 'DELETE':
            return remove(req, res)
        default:
            res.setHeader('Allow', ['POST', 'DELETE'])
            res.status(400).end(`Method ${method} not allowed`)
            break;
    }
}

export function randomGenres(genres, num) {
    const shuffled = genres.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, num)
}