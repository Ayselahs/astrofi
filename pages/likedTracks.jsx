import { useState, useEffect } from 'react'
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from '../config/session'
import axios from 'axios'
import dbConnect from '@/db/connection';
import User from '../db/models/user'
import Link from "next/link";
import styles from "../styles/Footer.module.css";
import historyStyles from "../styles/History.module.css"
import Sidebar from "@/components/header/Sidebar";
import { Image } from "next/image";

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
                        permanent: false,
                    }
                }
            }

            return {
                props: {
                    likedTracks: user.likedTracks || []
                }
            }
        } catch (err) {
            console.error('Error fetching liked tracks:', err)
            return {
                props: {
                    likedTracks: []
                }
            }
        }



    }, sessionOptions
)

export default function LikedPage({ likedTracks }) {
    const [tracks, setTracks] = useState(likedTracks)

    const handleDeleteTrack = async (trackId) => {
        try {
            const response = await fetch('/api/likeTrack', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ trackId })
            })

            console.log("Response", response)
            if (!response.ok) {
                throw new Error('Failed to like')
            }

            const result = await response.json()
            console.log("Result", result)
            setTracks((prevTracks) => prevTracks.filter((track) => track.id !== trackId))

        } catch (err) {
            console.error("Error:", err)
        }
    }

    return (
        <>
            <main className={historyStyles.layout}>
                <Sidebar />
                <div className={historyStyles.main}>
                    <h1 className={historyStyles.title}>Loved Playlist</h1>
                    <section className={historyStyles.history}>
                        <div className={historyStyles.item}>
                            {tracks.length > 0 ? (
                                tracks.map((track) => (
                                    <div className={historyStyles.entry}>
                                        {track.image && (
                                            <Image className={historyStyles.icon} src={track.image} alt={track.name} width={50} height={50} />

                                        )}

                                        <div className={historyStyles.text} key={track.id}>
                                            <a
                                                href={track.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <div className={historyStyles.date}>{track.name}</div>

                                            </a>
                                            <div className={historyStyles.descrip}>{track.artist}</div>

                                        </div>
                                        <button className={historyStyles.deleteBtn} onClick={() => handleDeleteTrack(track.id)}>
                                            <Image src="/delete.png" alt="Menu" />

                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No liked tracks</p>
                            )}
                        </div>
                    </section>
                </div>
            </main >

        </>

    )
}