import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Link from "next/link";
import styles from "../styles/Footer.module.css";
import historyStyles from "../styles/History.module.css"
import Sidebar from "@/components/Sidebar";
import dashStyles from "../styles/Dashboard.module.css"
import Image from "next/image";


export default function Histroy({ username }) {
    const [historyEntry, setHistoryEntry] = useState([])
    const [selectedEntry, setSelectedEntry] = useState(null)
    const [likedTracks, setLikedTracks] = useState()

    useEffect(() => {
        async function fetchHistoryEntries() {
            try {
                console.log("In here")
                const response = await fetch(`/api/historyEntry?username=${username}`)
                const data = await response.json()
                console.log("Data", data)
                setHistoryEntry(data)
                console.log("Data", data)
            } catch (err) {
                console.error('Error fetching entires', err)
            }

        }

        fetchHistoryEntries()
    }, [username])


    const openModal = (entry) => {
        setSelectedEntry(entry)
    }

    const closeModal = () => {
        setSelectedEntry(null)
    }

    const handleLike = async (track) => {

        try {
            const response = await fetch('/api/likeTrack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ track })
            })
            if (!response.ok) {
                throw new Error('Failed to like')
            }

            const result = await response.json()
            setLikedTracks((prev) => [...prev, likedTrack])
            console.log('Track liked', result)
        } catch (err) {
            console.error('Error liking track', err)
        }
    }

    const handleUnlike = async (trackId) => {
        try {
            const response = await fetch('/api/likeTrack', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ trackId })
            })
            if (!response.ok) {
                throw new Error('Failed to like')
            }

            const result = await response.json()
            setLikedTracks((prev) => prev.filter((track) => track.id !== trackId))
            console.log('Track unliked', result)
        } catch (err) {
            console.error('Error liking track', err)
        }
    }

    return (
        <>
            <main className={historyStyles.layout}>
                <Sidebar />
                <div className={historyStyles.main}>
                    <h1 className={historyStyles.title}>Recommendations History</h1>
                    <div className={historyStyles.divider} aria-hidden="true">
                        <section className={historyStyles.history}>

                            <div className={historyStyles.item}>
                                {historyEntry.length > 0 ? (
                                    historyEntry.map((entry) => (
                                        <div key={entry.id} className={historyStyles.entry} onClick={() => openModal(entry)}>
                                            <div className={historyStyles.icon} />
                                            <div className={historyStyles.text} >
                                                <div className={historyStyles.date}>{new Date(entry.createdAt).toLocaleDateString()}</div>
                                                <div className={historyStyles.descrip}>{entry.horoscope.prediction.slice(0, 90)}...</div>
                                            </div>

                                        </div>

                                    ))
                                ) : (
                                    <p>No history entries found</p>
                                )}
                                <div className={historyStyles.divider} />
                            </div>

                        </section>
                    </div>
                    {selectedEntry && (

                        <ReactModal
                            isOpen={!!selectedEntry}
                            onRequestClose={closeModal}
                            contentLabel="Entry Details"
                            className={historyStyles.modal}
                            overlayClassName={historyStyles.overlay}
                        >
                            <main className={dashStyles.dashboard}>
                                <button className={historyStyles.closeBtn} onClick={closeModal}>Close</button>
                                <section className={dashStyles.horoscope}>
                                    <p className={dashStyles.horoText}>
                                        {selectedEntry.horoscope.prediction}
                                    </p>
                                    <div className={dashStyles.horoDetails}>
                                        <div className={dashStyles.horoItem} key="element">
                                            <h3 className={dashStyles.horoLabel}>Element</h3>
                                            <p className={dashStyles.horoValue}>{selectedEntry.horoscope.element}</p>
                                        </div>
                                        <div className={dashStyles.horoItem} key="compatibility">
                                            <h3 className={dashStyles.horoLabel}>Compatibility</h3>
                                            <p className={dashStyles.horoValue}>{selectedEntry.horoscope.compatibility}</p>
                                        </div>
                                        <div className={dashStyles.horoItem} key="number">
                                            <h3 className={dashStyles.horoLabel}>Lucky Number</h3>
                                            <p className={dashStyles.horoValue}>{selectedEntry.horoscope.number}</p>
                                        </div>
                                    </div>
                                </section>
                                <section className={dashStyles.artist}>
                                    <h2 className={dashStyles.artistTitle}>Recommended Artists</h2>
                                    <div className={dashStyles.artistList}>
                                        {selectedEntry.artistRecs.map((artist) => (
                                            <div key={artist.id} className={dashStyles.artistItem}>
                                                {artist.images && artist.images.length > 0 && artist.images[0].url && (
                                                    <Image className={dashStyles.artistImg} src={artist.images[0].url} alt={artist.name} width={172} height={172} />

                                                )}
                                                <a
                                                    href={artist.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <p className={dashStyles.artistName}>{artist.name}</p>

                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                <section className={dashStyles.song}>
                                    <h2 className={dashStyles.sectionTitle}>Recommended Songs</h2>
                                    <div className={dashStyles.songList}>
                                        {selectedEntry.musicRecs.length > 0 ? (
                                            <div className={dashStyles.songList}>
                                                {selectedEntry.musicRecs.map((track) => (
                                                    <div className={dashStyles.songItem} key={track.id}>
                                                        {track.image && track.image.length > 0 && (
                                                            <Image className={dashStyles.songImg} src={track.image} alt={track.name} width={300} height={300} />

                                                        )}
                                                        <div className={dashStyles.songDetails}>
                                                            <a
                                                                href={track.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <div className={dashStyles.songTitle}>{track.name}</div>
                                                                <div className={dashStyles.songArtist}>by {track.artist}</div>
                                                            </a>


                                                        </div>





                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p> No Spotify recs..</p>
                                        )}

                                    </div>
                                    <button className={historyStyles.closeBtn} onClick={closeModal}>Close</button>
                                </section>
                            </main>

                        </ReactModal>
                    )}
                </div>
            </main>
        </>
        /*
        <main>

            <div>
                <Link href="/dashboard" className={styles.card}>
                    <h2>Back to Dashboard &rarr;</h2>
                    <p>go to Dashboard.</p>
                </Link>
                <h1>History</h1>
                <ul>
                    {historyEntry.length > 0 ? (
                        historyEntry.map((entry) => (
                            <li key={entry.id} onClick={() => openModal(entry)}>
                                {new Date(entry.createdAt).toLocaleDateString()}: {entry.horoscope.prediction.slice(0, 50)}...
                            </li>
                        ))
                    ) : (
                        <p>No history entries found</p>
                    )}

                </ul>

                {selectedEntry && (

                    <ReactModal
                        isOpen={!!selectedEntry}
                        onRequestClose={closeModal}
                        contentLabel="Entry Details"
                        style={{
                            content: {
                                backgroundColor: 'white',
                                color: 'black'
                            }
                        }}
                    >
                        <h2>Horoscopes</h2>
                        <p>{selectedEntry.horoscope.prediction}</p>
                        <p>Remedy: {selectedEntry.horoscope.remedy}</p>
                        <p>Color: {selectedEntry.horoscope.color}</p>
                        <p>Lucky Number: {selectedEntry.horoscope.number}</p>
                        <p>Element: {selectedEntry.horoscope.element}</p>
                        <p>Compatibility: {selectedEntry.horoscope.compatibility}</p>
                        <h2>Spotify Artist Recommendations</h2>
                        {selectedEntry.artistRecs.length > 0 ? (
                            <ul>
                                {selectedEntry.artistRecs.map((artist) => (
                                    <li key={artist.id}>
                                        <a
                                            href={artist.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {artist.name}
                                        </a>

                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p> No Spotify recs..</p>
                        )}
                        <h2>Spotify Track Recommendations</h2>
                        {selectedEntry.musicRecs.length > 0 ? (
                            <ul>
                                {selectedEntry.musicRecs.map((track) => (
                                    <li key={track.id}>
                                        <a
                                            href={track.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {track.name} by {track.artist}
                                        </a>
                                        {track.image && (
                                            <img src={track.image} alt={track.name} width={50} height={50} />
                                        )}

                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p> No Spotify recs..</p>
                        )}
                        <button onClick={closeModal}>Close</button>
                    </ReactModal>
                )}
            </div>
        </main>
        */

    )
}