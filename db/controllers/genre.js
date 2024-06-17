import GenreSchema from "@/db/models/genre";

export async function create(req, res) {
    try {
        const genre = await GenreSchema.create(req.body)
        res.status(200).json(genre)
    } catch (err) {
        res.status(500).json({ err: 'Error creating genre' })
    }
}

export async function remove(req, res) {
    try {
        const { id } = req.query
        await GenreSchema.findByIdAndDelete(id)
        res.status(200).end()
    } catch (err) {
        res.status(500).json({ err: 'Error deleting genre' })
    }
}