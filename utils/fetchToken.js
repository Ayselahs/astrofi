import axios from 'axios'

export default async function fetchToken() {
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
        return token
    } catch (error) {
        console.error("Error fetching Spotify", error);

    }
}