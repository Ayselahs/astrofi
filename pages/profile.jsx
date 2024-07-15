import { useState, useEffect } from 'react'
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import axios from 'axios'
import dbConnect from '@/db/connection';
import User from '../db/models/user'
import Link from "next/link";
import styles from "../styles/Home.module.css";


export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const userName = req.session.username
        const props = {}

        await dbConnect()

        try {
            const user = await User.findOne({ userName }).exec()

            if (!user) {
                return {
                    redirect: {
                        destination: '/login',
                        permanent: false
                    }
                }
            }
            return {
                props: {
                    user: JSON.parse(JSON.stringify(user))
                }
            }
        } catch (err) {
            console.error("Error updating zodiac", err)
        }


    }, sessionOptions
)

export default function Profile({ user }) {
    const [userData, setUserData] = useState(user)
    const [zodiac, setZodiac] = useState(user.zodiac)

    const handleUpdateZodiac = async () => {
        try {
            const response = await axios.put('/api/user/updateZodiac', {
                username: user.username,
                zodiac
            })
            setUserData(response.data)
            console.log("Zodiac updated")
        } catch (err) {
            console.error("Error updating zodiac", err)
            console.log("Zodiac not updated")
        }
    }


    return (
        <div>
            <Link href="/dashboard" className={styles.card}>
                <h2>Back to Dashboard &rarr;</h2>
                <p>go to Dashboard.</p>
            </Link>
            <h1>Profile</h1>
            <div>
                <p>Username: {userData.username}</p>
                <label htmlFor="zodiac">Zodiac Sign: </label>
                <select name="zodiac" value={zodiac} onChange={(e) => setZodiac(e.target.value)}>
                    <option value="">Select your zodiac sign</option>
                    <option value="aries">Aries</option>
                    <option value="taurus">Taurus</option>
                    <option value="gemini">Gemini</option>
                    <option value="cancer">Cancer</option>
                    <option value="leo">Leo</option>
                    <option value="virgo">Virgo</option>
                    <option value="libra">Libra</option>
                    <option value="scorpio">Scorpio</option>
                    <option value="sagittarius">Sagittarius</option>
                    <option value="capricorn">Capricorn</option>
                    <option value="aquarius">Aquarius</option>
                    <option value="pisces">Pisces</option>
                </select>
                <button onClick={handleUpdateZodiac}>Update Zodiac Sign</button>
            </div>
        </div>
    )
}