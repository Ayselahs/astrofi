import { Schema, model, models } from 'mongoose'

const HistoryEntrySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    horoscope: {
        prediction: {
            type: String,
            required: true
        },
        remedy: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true

        },
        compatibility: {
            type: String,
            required: true

        },
        date: {
            type: String,
            required: true

        },
        element: {
            type: String,
            required: true

        },
    },
    musicRecs: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        artist: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        }
    }],
    artistRecs: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },

    }],
    createdAt: {
        type: Date,
        default: Date.now
    }


})

export default models.HistoryEntry || model('HistoryEntry', HistoryEntrySchema)
