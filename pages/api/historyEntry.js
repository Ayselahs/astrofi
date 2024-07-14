import dbConnect from "@/db/connection";
import { add } from "../../db/controllers/historyEntry"

export default async function handler(req, res) {
    await dbConnect()

    switch (req.method) {
        case 'GET':
            return add(req, res)
        default:
            res.setHeader('Allow', ['GET'])
            res.status(400).end(`Method ${method} not allowed`)
            break;
    }
}