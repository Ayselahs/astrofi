import dbConnect from "@/db/connection";
import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import User from '../../db/models/user'
import mongoose from "mongoose";



export default withIronSessionApiRoute(
    async function handler(req, res) {
        const { track } = req.body
        const sessionUser = req.session.username
        switch (req.method) {
            case 'POST':

                //onsole.log("User", sessionUser)

                if (!sessionUser) {
                    res.status(401).json()
                }

                //const userName = sessionUser.username
                //console.log("sessionUser.username", userName)

                await dbConnect()

                try {
                    console.log("Connecting to database")
                    const dbUser = await User.findOne({ sessionUser }).exec()
                    console.log("dbUser", dbUser)

                    if (!dbUser) {
                        res.status(404).json()
                    }

                    if (!dbUser.likedTracks.some(likedTrack => likedTrack.id === track.id)) {
                        dbUser.likedTracks.push(track)
                    }


                    await dbUser.save()
                    res.status(200).json()
                } catch (err) {
                    res.status(500).json()
                }
            case 'DELETE':
                const { trackId } = req.body

                //onsole.log("User", sessionUser)

                //const userName = sessionUser.username
                //console.log("sessionUser.username", userName)

                await dbConnect()
                console.log("Connecting to database")

                try {
                    console.log("Connecting to database")
                    const dbUser = await User.findOne({ sessionUser }).exec()
                    console.log("dbUser", dbUser)

                    if (!dbUser) {
                        res.status(404).json()
                    }

                    dbUser.likedTracks = dbUser.likedTracks.filter(likedTrack => likedTrack.id !== trackId)


                    await dbUser.save()
                    res.status(200).json()
                } catch (err) {
                    res.status(500).json()
                }
            default:
                res.status(404).end

        }
    }, sessionOptions
)

