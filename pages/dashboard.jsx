import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Footer.module.css";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";
import dbConnect from "@/db/connection";
import User from "@/db/models/user"
import HoroscopeSchema from "@/db/models/horoscope";
import GenreSchema from "@/db/models/genre";
import MusicSchema from "@/db/models/musicRecs";
import RecsGenreSchema from "@/db/models/recsAndGenres";
import fetchHoroscope from '../utils/fetchHoroscope'
import fetchSpotify from '../utils/fetchSpotify'
import fetchGenres from '../utils/fetchGenres'
import fetchArtists from "@/utils/fetchArtists";
import fetchToken from "@/utils/fetchToken";
import { fetchDailyHoroscope, fetchSignData } from "@/utils/fetchBackUpHoro";
import HistoryEntry from "@/db/models/historyEntry"
import { extractWords, mapWords } from "@/utils/mapHoroscope";
import { randomGenres } from '../pages/api/genre'
import SpotifyWebPlayer from "react-spotify-web-playback";
import { useEffect, useState } from "react";
import Sidebar from '@/components/Sidebar'
import dashStyles from "../styles/Dashboard.module.css"

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    await dbConnect()
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;

      try {
        const dbUser = await User.findOne({ username: user.username })
        //console.log('Username:', dbUser)
        if (!dbUser) {
          console.error(`User not found for username: ${user.username}`)
        }
        const zodiac = dbUser.zodiac
        console.log("Zodiac", zodiac)

        const horoscopeData = await fetchDailyHoroscope(zodiac)
        //const predictionData = await fetchHoroscope(zodiac)
        const signData = await fetchSignData(zodiac)
        //console.log("Horoscope Data", horoscopeData)
        props.horoscope = {
          zodiac,
          prediction: horoscopeData.horoscope || 'No prediction',
          //color: predictionData.color || '',
          number: horoscopeData.lucky_number || '',
          compatibility: signData.compatibility || '',
          date: signData.date_range || '',
          element: signData.element || ''

        }
        //console.log("Horoscope Props", props.horoscope)

        const keywords = extractWords(horoscopeData.horoscope)
        const mappedGenres = mapWords(keywords)

        if (mappedGenres.length === 0) {
          throw new Error('No genres mapped only given', mappedGenres)
        }

        //First did randomized genres, moved to mapping genres with horoscope text
        /*const spotifyGenres = await fetchGenres()
        if (!spotifyGenres) {
          throw new Error('No genres avaliable')
        }
        const randomizedGenres = randomGenres(spotifyGenres, 3)
        console.log("Random Genres", randomizedGenres)*/

        const spotifyAccessToken = await fetchToken()
        console.log("Token", spotifyAccessToken)
        req.session.spotifyAccessToken = spotifyAccessToken
        await req.session.save()

        props.spotifyAccessToken = spotifyAccessToken


        const spotifyData = await fetchSpotify(mappedGenres)

        const artistData = await fetchArtists(mappedGenres)

        //console.log("Spotify Data", spotifyData)
        //console.log("Artist Data", artistData)
        props.spotifyData = spotifyData || []
        props.artistData = artistData || []
        //console.log("Spotify Props", props.spotifyData)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const existingEntry = await HistoryEntry.findOne({
          userId: dbUser._id,
          createdAt: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        })

        if (!existingEntry) {
          const createEntry = new HistoryEntry({
            userId: dbUser._id,
            horoscope: props.horoscope,
            musicRecs: spotifyData.map(track => ({
              id: track.id,
              name: track.name,
              artist: track.artists.map(artist => artist.name).join(', '),
              url: track.external_urls.spotify,
              image: track.album.images.length > 0 ? track.album.images[0].url : ''
            })),
            artistRecs: artistData.map(artist => ({
              id: artist.id,
              name: artist.name,
              url: artist.external_urls.spotify,
              images: artist.images.map(image => ({
                url: image.url,
              }))
            })),
          })
          await createEntry.save()
        }

      } catch (err) {
        console.error('Error fetching:', err)
        props.horoscope = { horoscope: 'Error fetching horoscope' }
        props.spotifyData = []
        props.artistData = []
      }


    } else {
      props.isLoggedIn = false;
      props.horoscope = { prediction: 'No horoscope' }
      props.spotifyData = []
      props.artistData = []
    }
    return {
      props
    };
  },
  sessionOptions
);

export default function Dashboard({ spotifyAccessToken, ...props }) {
  const router = useRouter();
  const logout = useLogout();
  const [recommendations, setRecommendations] = useState(props.spotifyData)
  const [artists, setArtists] = useState(props.artistData)
  const [player, setPlayer] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [trackProgress, setTrackProgress] = useState(0)
  const [tracks, setTracks] = useState([])
  const [volume, setVolume] = useState(0.5)

  //console.log("Artist", artists)
  //console.log("Recommendations", recommendations)
  //console.log("Spotify Access:", spotifyAccessToken)




  const handleLike = async (track) => {

    const likedTrack = {
      id: track.id,
      name: track.name,
      url: track.external_urls.spotify,
      image: track.album.images[0].url,
      artist: track.artists.map(artist => artist.name).join(', ')
    }

    try {
      const response = await fetch('/api/likeTrack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ track: likedTrack })
      })
      if (!response.ok) {
        throw new Error('Failed to like')
      }

      const result = await response.json()
      setTracks((prev) => [...prev, likedTrack])
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
      setTracks((prev) => prev.filter((track) => track.id !== trackId))
      console.log('Track unliked', result)
    } catch (err) {
      console.error('Error liking track', err)
    }
  }


  return (
    <>
      <div>
        <Sidebar />
        <main className={dashStyles.dashboard}>
          <h1 className={dashStyles.bigTitle}>Daily Horoscope Recommendations</h1>
          <section className={dashStyles.horoscope}>
            <p className={dashStyles.horoText}>
              {props.horoscope.prediction}
            </p>
            <div className={dashStyles.horoDetails}>
              <div className={dashStyles.horoItem}>
                <h3 className={dashStyles.horoLabel}>Element</h3>
                <p className={dashStyles.horoValue}>{props.horoscope.element}</p>
              </div>
              <div className={dashStyles.horoItem}>
                <h3 className={dashStyles.horoLabel}>Compatibility</h3>
                <p className={dashStyles.horoValue}>{props.horoscope.compatibility}</p>
              </div>
              <div className={dashStyles.horoItem}>
                <h3 className={dashStyles.horoLabel}>Lucky Number</h3>
                <p className={dashStyles.horoValue}>{props.horoscope.number}</p>
              </div>
            </div>
          </section>
          <section className={dashStyles.artist}>
            <h2 className={dashStyles.artistTitle}>Recommended Artists</h2>
            <div className={dashStyles.artistList}>
              {artists.map((artist) => (
                <div key={artist.id} className={dashStyles.artistItem}>
                  {artist.images && artist.images.length > 0 && (
                    <Image className={dashStyles.artistImg} src={artist.images[0].url} alt={artist.name} width={50} height={50} />

                  )}
                  <a
                    href={artist.external_urls.spotify}
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
              {recommendations.length > 0 ? (
                recommendations.map((track) => (
                  <div className={dashStyles.songItem} key={track.id}>
                    {track.album.images && track.album.images.length > 0 && (
                      <Image className={dashStyles.songImg} src={track.album.images[0].url} alt={track.name} width={50} height={50} />
                    )}

                    <div className={dashStyles.songDetails}>
                      <a
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className={dashStyles.songTitle}>{track.name}</div>
                        <div className={dashStyles.songArtist}>by {track.artists.map(artist => artist.name).join(', ')}</div>
                      </a>
                      {tracks.some((t) => t.id === track.id) ? (
                        <button className={dashStyles.likeBtn} onClick={() => handleUnlike(track.id)}>
                          <Image src="/heart.png" alt="unlike" width={50} height={50} />
                        </button>
                      ) : (
                        <button className={dashStyles.likeBtn} onClick={() => handleLike(track)}>
                          <Image src="/Heart-2.png" alt="like" width={50} height={50} />

                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p> No Spotify recs..</p>
              )}
            </div>
          </section>
        </main>
        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </div>



    </>

  );
}
