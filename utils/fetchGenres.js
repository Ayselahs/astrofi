import axios from 'axios'

export default async function fetchGenres() {
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

        //console.log("Token", token)

        const genreRes = await axios.get(
            "https://api.spotify.com/v1/recommendations/available-genre-seeds",
            {
                headers: {
                    'Authorization': "Bearer " + token,
                }
            }
        );
        //console.log("Recs", recommendRes)

        return genreRes.data.genres
    } catch (error) {
        console.error("Error fetching Spotify Genres", error);

    }
}