import dbConnect from "@/db/connection";
import { add } from "../../db/controllers/historyEntry"
import User from "@/db/models/user"
import HistoryEntrySchema from '@/db/models/historyEntry'

export default async function handler(req, res) {
    await dbConnect()
    const { username } = req.query
    const { method } = req

    console.log("User", { username })
    console.log("Method", { method })

    if (!username) {
        return res.status(400).json({ error: 'Username required' })
    }

    switch (method) {
        case 'GET':
            try {
                console.log("Fetching from database")

                console.log("Method", { method })
                const entry = await HistoryEntrySchema.find({ username }).sort({ date: -1 }).lean()
                console.log("Method", { method })
                console.log("Fetched entry", entry)
                return res.status(200).json(entry)
            } catch (err) {
                res.status(500).json({ err: 'Error fetching entries' })
            }
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end('Method not allowed')
            break;
    }
}