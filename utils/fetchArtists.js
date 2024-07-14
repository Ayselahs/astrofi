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
                    limit: 5
                }
            }
        );
        //console.log("Recs", recommendRes)

        const artistRecs = artistRes.data.tracks
        const artists = artistRecs.map(track => track.artists).flat()
        const uniquePicks = Array.from(new Set(artists.map(artist => artist.id))).map(id => artists.find(artist => artist.id === id))

        //console.log("Unique", uniquePicks)

        return uniquePicks

    } catch (error) {
        console.error("Error fetching Artists", error);

    }
}
