import axios from 'axios'
export default async function fetchHoroscope(zodiac) {

    const options = {
        method: 'GET',
        url: 'https://best-daily-astrology-and-horoscope-api.p.rapidapi.com/api/Detailed-Horoscope/',
        params: { zodiacSign: zodiac },
        headers: {
            'x-rapidapi-key': '06eb58b04bmsha7e9c277cce0fdbp105304jsna421ae58040e',
            'x-rapidapi-host': 'best-daily-astrology-and-horoscope-api.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        //console.log(response.data);
        return response.data
    } catch (error) {
        console.error(error);
    }









}




