import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
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
        const predictionData = await fetchHoroscope(zodiac)
        const signData = await fetchSignData(zodiac)
        //console.log("Horoscope Data", horoscopeData)
        props.horoscope = {
          zodiac,
          prediction: predictionData.prediction || 'No prediction',
          color: predictionData.color || '',
          remedy: predictionData.remedy || '',
          number: predictionData.number || '',
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
  const [volume, setVolume] = useState(0.5)

  //console.log("Artist", artists)
  //console.log("Recommendations", recommendations)
  console.log("Spotify Access:", spotifyAccessToken)

  useEffect(() => {
    console.log("Spotify Access Token:", spotifyAccessToken)
    if (!spotifyAccessToken) return
    const initializePlayer = () => {
      console.log("Initializing Player")
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(spotifyAccessToken) },
        volume: 0.5
      })

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready Device', device_id)
        setIsInitialized(true)
        setPlayer(player)
      })

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Offline Device', device_id)
      })

      player.addListener('player_state_changed', state => {
        console.log('Player State Changed', state)
      })

      player.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK is connected to Spotify')
        } else {
          console.log('The Web Playback SDK failed to connect')
        }
      })

      setPlayer(player)
    }

    if (window.Spotify) {
      initializePlayer()
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer
    }

  }, [spotifyAccessToken])

  const doNextTrack = () => {
    if (player) {
      player.nextTrack().then(() => {
        console.log("Track skipped")
      })
    }

  }

  const doPreviousTrack = () => {
    if (player) {
      player.PreviousTrack().then(() => {
        console.log("Track to previous")
      })
    }
  }

  const doVolume = (e) => {
    const volume = parseFloat(e.target.value)
    setVolume(volume)
    if (player) {
      player.setVolume(volume).then(() => {
        console.log(`Volume set to ${volume}`)
      })
    }

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
      console.log('Track liked', result)
    } catch (err) {
      console.error('Error liking track')
    }
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props.user.username} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to a <a href="https://nextjs.org">Next.js!</a> Dashboard Page!
        </h1>

        <p className={styles.description}>
          Current Location: <code className={styles.code}>{router.asPath}</code>
          <br />
          Status:{" "}
          <code className={styles.code}>
            {!props.isLoggedIn && " Not"} Logged In
          </code>
        </p>

        <p className={styles.description}>
          This page is only visible if you are logged in.
        </p>

        <div className={styles.grid}>
          <Link href="/" className={styles.card}>
            <h2>Home &rarr;</h2>
            <p>Return to the homepage.</p>
          </Link>
          <Link href="/history" className={styles.card}>
            <h2>History &rarr;</h2>
            <p>go to history.</p>
          </Link>
          <Link href="/profile" className={styles.card}>
            <h2>Profile &rarr;</h2>
            <p>go to history.</p>
          </Link>
          <Link href="/likedTracks" className={styles.card}>
            <h2>Loved Songs &rarr;</h2>
            <p>go to history.</p>
          </Link>

          <div
            onClick={logout}
            style={{ cursor: "pointer" }}
            className={styles.card}
          >
            <h2>Logout &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </div>
        </div>
        {props.isLoggedIn && (
          <>

            <h2>Horoscopes</h2>
            <p>{props.horoscope.prediction}</p>
            <p>Remedy: {props.horoscope.remedy}</p>
            <p>Color: {props.horoscope.color}</p>
            <p>Lucky Number: {props.horoscope.number}</p>
            <p>Element: {props.horoscope.element}</p>
            <p>Compatibility: {props.horoscope.compatibility}</p>
            <h2>Spotify Artist Recommendations</h2>
            {artists.length > 0 ? (
              <ul>
                {artists.map((artist) => (
                  <li key={artist.id}>
                    <a
                      href={artist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {artist.name}
                    </a>
                    {artist.images && artist.images.length > 0 && (
                      <img src={artist.images[0].url} alt={artist.name} width={50} height={50} />
                    )}

                  </li>
                ))}
              </ul>
            ) : (
              <p> No Spotify recs..</p>
            )}
            <h2>Spotify Track Recommendations</h2>
            {recommendations.length > 0 ? (
              <ul>
                {recommendations.map((track) => (
                  <li key={track.id}>
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {track.name} by {track.artists.map(artist => artist.name).join(', ')}
                    </a>
                    {track.album.images && track.album.images.length > 0 && (
                      <img src={track.album.images[0].url} alt={track.name} width={50} height={50} />
                    )}
                    <button onClick={() => handleLike(track)}>Like</button>

                  </li>
                ))}
              </ul>
            ) : (
              <p> No Spotify recs..</p>
            )}
            {isInitialized && (
              <>
                <button onClick={() => player.togglePlay()}>
                  {player && player.paused ? 'Play' : 'Pause'}
                </button>
                <button onClick={doNextTrack}>Next</button>
                <button onClick={doPreviousTrack}>Previous</button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={doVolume}
                />
                <div>
                  <progress value={trackProgress} max={180}></progress>
                </div>
              </>
            )}


          </>
        )}
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
  );
}
