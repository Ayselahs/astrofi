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
        love: "romance",
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
        sociable: "funk"

    }

    const mappedGenres = [...new Set(keywords.map(word => genreMap[word.toLowerCase()]).filter(genre => genre !== undefined))].slice(0, 5)
    console.log("Mapped", mappedGenres)


    return mappedGenres

}