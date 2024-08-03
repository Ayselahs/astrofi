import dbConnect from "@/db/connection";
import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import User from '../../db/models/user'
import mongoose from "mongoose";
import { addTracks, removeTracks } from "@/db/controllers/likedTracks";



export default withIronSessionApiRoute(
    async function handler(req, res) {
        const { track } = req.body
        const sessionUser = req.session.username
        switch (req.method) {
            case 'POST':
                try {
                    //onsole.log("User", sessionUser)
                    const addedTrack = await addTracks(sessionUser, track)

                    if (!addedTrack) {
                        res.status(401).json({ message: 'User not found or track not added' })
                    }

                    return res.status(200).json({ message: 'Track added', track })

                    //const userName = sessionUser.username
                    //console.log("sessionUser.username", userName)




                } catch (err) {
                    res.status(500).json({ message: 'Internal error', err })
                }
            case 'DELETE':
                const { trackId } = req.body

                try {
                    //onsole.log("User", sessionUser)

                    const success = await removeTracks(sessionUser, trackId)

                    if (!success) {
                        return res.status(404).json({ message: 'User not found or track not removed' })
                    }

                    return res.status(200).json({ message: 'Track removed' })

                    //const userName = sessionUser.username
                    //console.log("sessionUser.username", userName)






                } catch (err) {
                    res.status(500).json({ message: 'Internal error', err })
                }
            default:
                res.status(405).end('Method not Allowed')

        }
    }, sessionOptions
)

