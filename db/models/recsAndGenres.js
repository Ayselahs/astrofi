import { Schema, model, models } from 'mongoose'

const RecsGenreSchema = new Schema({
    recommendationId: {
        type: Schema.Types.ObjectId,
        ref: 'MusicRecs',
        required: true
    },
    horoscopeId: {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
})

export default RecsGenreSchema || model('RecsGenre', RecsGenreSchema)