import dbConnect from "@/db/connection";
import { create, remove } from '../../db/controllers/recommendations'

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