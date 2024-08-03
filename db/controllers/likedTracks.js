import User from '../models/user'
import dbConnect from '../connection'

export async function addTracks(userName, track) {
    await dbConnect()
    const user = await User.findOneAndUpdate(
        { userName },
        { $addToSet: { likedTracks: track } },
        { new: true }
    )

    if (!user) return null
    const addedTrack = user.likedTracks.find(tracks => tracks.id === track.id)
    return addTracks
}

export async function removeTracks(userName, trackId) {
    await dbConnect()
    const user = await User.findOneAndUpdate(
        { userName },
        { $pull: { likedTracks: { id: trackId } } },
        { new: true }
    )

    if (!user) return null

    return true
}

