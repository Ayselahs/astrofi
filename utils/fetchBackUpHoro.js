import axios from 'axios'

export async function fetchDailyHoroscope(zodiac) {

    const options = {
        method: 'GET',
        url: 'https://horoscope-astrology.p.rapidapi.com/horoscope',
        params: {
            day: 'today',
            sunsign: zodiac
        },
        headers: {
            'x-rapidapi-key': process.env.RADPIDAPI_KEY,
            'x-rapidapi-host': process.env.RADPIDAPI_HOST
        }
    };

    try {
        const response = await axios.request(options);
        //console.log(response.data);
        return response.data
    } catch (error) {
        console.error('Cannot fetch Horoscope', error);
    }

}

export async function fetchSignData(zodiac) {

    const options = {
        method: 'GET',
        url: 'https://horoscope-astrology.p.rapidapi.com/sign',
        params: {
            s: zodiac
        },
        headers: {
            'x-rapidapi-key': process.env.RADPIDAPI_KEY,
            'x-rapidapi-host': process.env.RADPIDAPI_HOST
        }
    };

    try {
        const response = await axios.request(options);
        //console.log(response.data);
        return response.data
    } catch (error) {
        console.error('Cannot fetch Horoscope', error);
    }

}

export async function fetchQuoteData() {

    const options = {
        method: 'GET',
        url: 'https://horoscope-astrology.p.rapidapi.com/dailyphrase',
        headers: {
            'x-rapidapi-key': process.env.RADPIDAPI_KEY,
            'x-rapidapi-host': process.env.RADPIDAPI_HOST
        }
    };

    try {
        const response = await axios.request(options);
        //console.log(response.data);
        return response.data
    } catch (error) {
        console.error('Cannot fetch Horoscope', error);
    }

}

