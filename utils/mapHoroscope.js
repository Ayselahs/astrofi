export function extractWords(text) {
    const keywords = []
    const words = text.split(/\W+/)
    const commonWords = ["the", "and", "is", "in", "to", "with", "it", "of", "for", "on", "this", "that"]

    words.forEach(word => {
        if (!commonWords.includes(word.toLowerCase()) && word.length > 3) {
            keywords.push(word.toLowerCase())
        }
    });
    console.log("Extracted Words", keywords)

    return keywords

}

//Mapping words to get genres so that the recommendations make sense
export function mapWords(keywords) {
    const genreMap = {
        love: "quiet storm",
        party: "dance",
        relax: "chill",
        focus: "study",
        workout: "work-out",
        happy: "pop",
        sad: "blues",
        energy: "rock",
        calm: "ambient",
        balance: "chill",
        harmony: "r-n-b",
        obstacles: "gospel",
        challenges: "acoustic",
        conflicts: "hip-hop",
        relationships: "romance",
        honest: "jazz",
        patience: "ambient",
        peace: "happy",
        resolve: "study",
        finacial: "classical",
        budget: "classical",
        strength: "hip-hop",
        resilience: "gospel",
        female: "pop",
        male: "rock",
        friend: "indie-pop",
        haven: "ambient",
        suprise: "electronic",
        intresting: "soul",
        news: "rock",
        information: "alternative",
        exchanged: "r-n-b",
        benefits: "funk",
        journeys: "folk",
        throughout: "alternative",
        needs: "soul",
        income: "hip-hop",
        evening: "jazz",
        short: "indie",
        romantic: "romance",
        video: "electronic",
        longingly: "r-n-b",
        exotic: "reggaeton",
        traveling: "pop",
        wonder: "classical",
        thinking: "rainy-day",
        live: "new-age",
        today: "road-trip",
        yourself: "sleep",
        explore: "world-music",
        intrest: "pop",
        beethoven: "classical",
        appealing: "romance",
        flowers: "rainy-day",
        poetry: "classical",
        surround: "ambient",
        favorite: "chill",
        want: "chill",
        talent: "classical",
        movie: "movies",
        gain: "work-out",
        your: "new-age",
        rosy: "romance",
        disappointment: "sad",
        find: "soul",
        irritating: "heavy-metal",
        visible: "electronic",
        blossoms: "rainy-day",
        partners: "romance",
        rose: "romance",
        happier: "groove",
        sociable: "funk",
        issues: "Rock",
        care: "r-n-b",
        brewing: "garage",
        whether: "funk",
        need: "happy",
        lead: "quiet storm",
        possible: "gospel",
        order: "classic soul",
        structure: "pop",
        coming: "new-age",
        important: "classical",
        practical: "acoustic",
        take: "work-out",
        granted: "r-n-b",
        realize: "alternative",
        necessarily: "rainy-day",
        mean: "jazz",
        everything: "pop",
        perfect: "classical",
        discipline: "classical",
        often: "indie-pop",
        required: "classical",
        maintain: "ambient",
        healthy: "chill",
        partnership: "romance",
        should: "r-n-b",
        able: "soul",
        incorporate: "alternative",
        elements: "ambient",
        well: "chill",
        libra: "new-age",
        leo: "rock",
        aries: "hip-hop",
        taurus: "classical",
        gemini: "pop",
        cancer: "jazz",
        virgo: "r-n-b",
        scorpio: "rock",
        capricorn: "classical soul",
        aquarius: "electronic",
        pisces: "ambient",
        sagittarius: "world-music"

    }

    const mappedGenres = [...new Set(keywords.map(word => genreMap[word.toLowerCase()]).filter(genre => genre !== undefined))].slice(0, 5)
    console.log("Mapped", mappedGenres)


    return mappedGenres

}