import HistoryEntrySchema from "@/db/models/historyEntry";
import dbConnect from "../connection";

export async function add(req, res) {
    await dbConnect()
    const sessionUser = req.query
    console.log("User", sessionUser)
    try {
        const entry = await HistoryEntrySchema.find({ sessionUser }).sort({ date: -1 })
        return res.status(200).json(entry)
    } catch (err) {
        res.status(500).json({ err: 'Error fetching entries' })
    }
}