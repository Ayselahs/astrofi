import HoroscopeSchema from "@/db/models/horoscope";

export async function create(req, res) {
    try {
        const horoscope = await HoroscopeSchema.create(req.body)
        res.status(200).json(horoscope)
    } catch (err) {
        res.status(500).json({ err: 'Error creating horoscope' })
    }
}

export async function remove(req, res) {
    try {
        const { id } = req.query
        await HoroscopeSchema.findByIdAndDelete(id)
        res.status(200).end()
    } catch (err) {
        res.status(500).json({ err: 'Error deleting horoscope' })
    }
}