import MusicSchema from "@/db/models/musicRecs";
import RecsGenreSchema from "@/db/models/recsAndGenres";

export async function create(req, res) {
    try {
        const reccomendation = await MusicSchema.create(req.body.reccomendation)
        const genre = req.body.genre

        for (const genreId of genre) {
            await RecsGenreSchema.create({ reccomendationId: reccomendation._id, genreId })
        }
        res.status(200).json(reccomendation)
    } catch (err) {
        res.status(500).json({ err: 'Error creating recommendation' })
    }
}

export async function remove(req, res) {
    try {
        const { id } = req.query
        await MusicSchema.findByIdandDelete(id)
        await RecsGenreSchema.deleteMany({ reccomendationId: id })
        res.status(200).end()
    } catch (err) {
        res.status(500).json({ err: 'Error deleting recommendation' })
    }
}