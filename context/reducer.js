import * as actions from './actions'
import initialState from './state'

export default function reducer(state, { type, payload }) {
    switch (type) {
        case actions.LOGIN_USER:
            return { ...state, user: payload }
        case actions.LOGOUT_USER:
            return initialState
        case actions.FETCH_HOROSCOPE:
            return { ...state, horoscope: payload }
        case actions.FETCH_HISTORY:
            return { ...state, history: payload }
        case actions.FETCH_LOVED_SONGS:
            return { ...state, lovedSongs: payload }
        case actions.FETCH_SONG_DATA:
            return { ...state, songData: payload }
        case actions.FETCH_ARTIST_DATA:
            return { ...state, artistData: payload }
        case actions.UPDATE_USER:
            return { ...state, user: { ...state.user, ...payload } }
        default:
            return state
    }
}
