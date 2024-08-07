import { useState, useEffect } from 'react'
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import axios from 'axios'
import dbConnect from '@/db/connection';
import User from '../db/models/user'
import Link from "next/link";
import styles from "../styles/Home.module.css";
import profileStyles from "../styles/Profile.module.css"
import { fetchQuoteData } from '@/utils/fetchBackUpHoro';
import Sidebar from '@/components/Sidebar';
import useLogout from '@/hooks/useLogout';
import Image from "next/image";
import { useUserContext } from '@/context';
import { UPDATE_USER } from '@/context/actions';


export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const userName = req.session.user
        console.log("username", userName)
        const props = {}



        await dbConnect()

        try {
            const user = await User.findById(userName._id).lean()
            console.log('Username:', user)

            if (!user) {
                return {
                    redirect: {
                        destination: '/login',
                        permanent: false
                    }
                }
            }

            const horoscopeData = await fetchQuoteData()

            const quote = {
                dailyQuote: horoscopeData.daily
            }

            return {
                props: {
                    user: JSON.parse(JSON.stringify(user)),
                    quote
                }
            }
        } catch (err) {
            console.error("Error updating zodiac", err)
            return {
                props: {
                    user: null,
                    quote: [],
                }
            }

        }




    }, sessionOptions
)

export default function Profile({ user, quote }) {
    const logout = useLogout()
    const { state, dispatch } = useUserContext()
    const [userData, setUserData] = useState(user)
    const [zodiac, setZodiac] = useState(user.zodiac)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (user) {
            dispatch({ type: UPDATE_USER, payload: user })
        }
    }, [user, dispatch])

    const handleUpdateZodiac = async () => {
        setIsEditing(true)
    }

    const handleSubmitZodiac = async () => {
        try {
            const response = await axios.put('/api/user/updateZodiac', {
                username: user.username,
                zodiac
            })
            setUserData(response.data)
            console.log("Zodiac updated")
            dispatch({ type: UPDATE_USER, payload: response.data })

            setIsEditing(false)
        } catch (err) {
            console.error("Error updating zodiac", err)
            console.log("Zodiac not updated")
        }
    }



    return (
        <>
            <div className={profileStyles.profile}>
                <Sidebar />
                <main className={profileStyles.content}>
                    <div className={profileStyles.divider} />
                    <header className={profileStyles.header}>
                        <div className={profileStyles.logoutBtn} onClick={logout}>Logout</div>
                        <blockquote className={profileStyles.quote}>{quote.dailyQuote}</blockquote>
                    </header>
                    <section className={profileStyles.user}>
                        <Image loading="lazy"
                            src="/Mask group.png"
                            className={profileStyles.avatar}
                            alt="avatar" width={288} height={288} />

                        <div className={profileStyles.info}>
                            <h1 className={profileStyles.userName}>{userData.username}</h1>
                            {!isEditing && <p className={profileStyles.userName}>{userData.zodiac}</p>}
                            {!isEditing && (
                                <button className={profileStyles.editBtn} onClick={handleUpdateZodiac}>Edit Profile</button>
                            )}


                            {isEditing && (
                                <div>
                                    <label className={profileStyles.zodiac} htmlFor={profileStyles.zodiac}>Zodiac Sign: </label>
                                    <select className={profileStyles.zodiacValue} name="zodiac" value={zodiac} onChange={(e) => setZodiac(e.target.value)}>
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
                                    <button className={profileStyles.submitBtn} onClick={handleSubmitZodiac}>Submit</button>
                                </div>



                            )}


                        </div>



                    </section>

                </main>
            </div>


        </>

    )
}