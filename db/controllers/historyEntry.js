import HistoryEntrySchema from "@/db/models/historyEntry";
import dbConnect from "../connection";

export async function add(req, res) {
    await dbConnect()
    const { username } = req.query
    try {
        const entry = await HistoryEntrySchema.find({ username }).sort({ date: -1 })
        res.status(200).json(entry)
    } catch (err) {
        res.status(500).json({ err: 'Error fetching entries' })
    }
}