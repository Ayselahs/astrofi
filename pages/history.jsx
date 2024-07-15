import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Link from "next/link";
import styles from "../styles/Home.module.css";


export default function Histroy() {
    const [historyEntry, setHistoryEntry] = useState([])
    const [selectedEntry, setSelectedEntry] = useState(null)

    useEffect(() => {
        async function fetchHistoryEntries() {
            try {
                const response = await fetch('/api/historyEntry')
                const data = await response.json()
                setHistoryEntry(data)
            } catch (err) {
                console.error('Error fetching entires', err)
            }

        }

        fetchHistoryEntries()
    }, [])


    const openModal = (entry) => {
        setSelectedEntry(entry)
    }

    const closeModal = () => {
        setSelectedEntry(null)
    }

    return (
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

    )
}