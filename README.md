# AstroFi
AstroFi is an innovative approach to a web application designed to enhance a user’s emotional well-being by integrating personalized music recommendations with daily horoscope insights. AstroFi aims to provide a therapeutic emotional support system for all targeted users by combining these two APIs. AstroFi targets individuals who seek emotional guidance in their daily lives through either music or astrology. 

## Project Idea and Purpose
AstroFi was created to bridge the gap between astrology and music, offering users a novel way to engage with their daily horoscope. The application provides daily horoscope readings and recommends songs that match the user's astrological sign for that day. This personalized approach helps users find a deeper connection with their horoscope and enjoy music that resonates with their current mood and energy.

## Key Features
- **Daily Horoscope-based music and artist recommendations**
- **User-friendly Interface**
- **Ability to save a playlist of your favorite song recommendations**
- **Ability to go to previous recommendations**
- **Ability to update your profile**

## Live Site
You can access the live site here: [AstroFi Live Site](https://astrofi.vercel.app) 

# Instructions for Running/Contributing Application
1. Clone the repositorry:
   ```bash
   git clone https://github.com/Ayselahs/astrofi.git
   cd astrofi
   ```

2. Install dependencies:
   ```bash
   npm install
   # or 
   yarn install
   ```

3. Set up enviorment variables:
    - Create a `.env.local` file in the root directory.
    - Add the following environment variables:
        ```bash
        NEXT_PUBLIC_API_URL=https://horoscope-astrology.p.rapidapi.com
        NEXT_PUBLIC_HOROSCOPE_API_KEY=your_horoscope_api_key
        ``` 
4. Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
    ```

### Building for Production

To create a production build, run:

```bash
npm run build
# or
yarn build

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
