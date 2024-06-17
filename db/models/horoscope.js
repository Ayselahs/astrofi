import { Schema, model, models } from 'mongoose'

const HoroscopeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    zodiac: {
        type: String,
        required: true
    },
    prediction: {
        type: String,
        required: true
    },
    number: {
        type: String,

    },
    color: {
        type: String,

    },
    mantra: {
        type: String,

    },
    remedy: {
        type: String,

    },
    date: {
        type: Date,
        default: Date.now
    },
})

export default HoroscopeSchema || model('Horoscope', HoroscopeSchema)