import axios from 'axios'

export default async function fetchSpotify(genres) {
    const clientId = process.env.SPOTIFY_ID
    const clientSecret = process.env.SPOTIFY_SECRET
    try {
        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: 'client_credentials'
            }).toString(),

            {
                headers: {
                    'Authorization': "Basic " + Buffer.from(clientId + ":" + clientSecret).toString('base64'),
                    "Content-Type": "application/x-www-form-urlencoded",
                },

            }
        );

        //console.log("Token Res", tokenResponse)

        const token = tokenResponse.data.access_token;

        console.log("Genres: ", genres, Array.isArray(genres))

        //console.log("Token", token)

        const recommendRes = await axios.get(
            "https://api.spotify.com/v1/recommendations",
            {
                headers: {
                    'Authorization': "Bearer " + token,
                },
                params: {
                    seed_genres: genres.join(',')
                }
            }
        );
        //console.log("Recs", recommendRes)

        return recommendRes.data.tracks
    } catch (error) {
        console.error("Error fetching Spotify", error);

    }
}
