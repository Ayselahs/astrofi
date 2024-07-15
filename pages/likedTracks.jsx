import { useState, useEffect } from 'react'
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from '../config/session'
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

            if (response.ok) {
                setTracks(tracks.filter(track => track.id !== trackId))
            } else {
                console.error("Failed to delete")
            }
        } catch (err) {
            console.error("Error:", err)
        }
    }

    return (
        <div>
            <Link href="/dashboard" className={styles.card}>
                <h2>Back to Dashboard &rarr;</h2>
                <p>go to Dashboard.</p>
            </Link>
            <h1>Liked Songs Playlist</h1>
            {tracks.length > 0 ? (
                <ul>
                    {likedTracks.map((track) => (
                        <li key={track.id}>
                            <a
                                href={track.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {track.name} {track.artist}
                            </a>
                            {track.image && (
                                <img src={track.image} alt={track.name} width={50} height={50} />
                            )}
                            <button onClick={() => handleDeleteTrack(track.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No liked tracks</p>
            )}

        </div>
    )
}