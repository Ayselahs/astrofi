import axios from 'axios'
import fetchToken from '../utils/fetchToken'

export default async function fetchArtists(genres) {
    try {
        const token = await fetchToken();

        //console.log("Genres: ", genres, Array.isArray(genres))

        //console.log("Token", token)

        const artistRes = await axios.get(
            "https://api.spotify.com/v1/recommendations",
            {
                headers: {
                    'Authorization': "Bearer " + token,
                },
                params: {
                    seed_genres: genres.join(','),
                    limit: 7
                }
            }
        );
        //console.log("Recs", recommendRes)

        const artistRecs = artistRes.data.tracks
        const artists = artistRecs.map(track => track.artists).flat()
        const uniquePicks = Array.from(new Set(artists.map(artist => artist.id)))

        const artistDetails = await Promise.all(
            uniquePicks.map(async (id) => {
                const artistDetailsRes = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
                    headers: {
                        'Authorization': "Bearer " + token,
                    }
                })
                return artistDetailsRes.data
            })
        )

        //console.log("Unique", uniquePicks)

        return artistDetails

    } catch (error) {
        console.error("Error fetching Artists", error);

    }
}
