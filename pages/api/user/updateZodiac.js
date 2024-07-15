import dbConnect from "@/db/connection";
import { withIronSessionApiRoute } from "iron-session/next";
import User from '../../../db/models/user'
import sessionOptions from '../../../config/session'


export default withIronSessionApiRoute(
    async function handler(req, res) {
        await dbConnect()
        switch (req.method) {
            case 'PUT':
                const { username, zodiac } = req.body
                const user = await User.findOneAndUpdate({ username: username }, { zodiac }, { new: true })

                if (!user) {
                    return res.status(400).json()
                }

                res.status(200).json(user)
                break
            default:
                res.status(500).json()
                break;
        }
    }, sessionOptions
)
