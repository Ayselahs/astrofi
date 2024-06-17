import { Schema, model, models } from 'mongoose'

const MusicSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    horoscopeId: {
        type: Schema.Types.ObjectId,
        ref: 'Horoscope',
        required: true
    },
    trackName: {
        type: String,
        required: true
    },
    artistName: {
        type: String,
        required: true
    },
    albumName: {
        type: String,
        required: true
    },
    spotifyTrackId: {
        type: String,
        required: true
    },
    genreId: {
        type: Schema.Types.ObjectId,
        ref: 'Genre'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export default MusicSchema || model('MusicRecs', MusicSchema)