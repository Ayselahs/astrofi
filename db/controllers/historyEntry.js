import HistoryEntrySchema from "@/db/models/historyEntry";

export async function add(req, res) {
    try {
        const entry = await HistoryEntrySchema.find().sort({ date: -1 })
        res.status(200).json(entry)
    } catch (err) {
        res.status(500).json({ err: 'Error fetching entries' })
    }
}