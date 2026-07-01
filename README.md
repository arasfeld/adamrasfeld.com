This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Spotify Setup

To get the Spotify integration set up, you must have created an application on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

Select your application and navigate to the "Settings" page. Copy the "Client ID" and "Client Secret" values, and paste them into your `.env.local` file under the `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` environment variables respectively.

Set the `SPOTIFY_REDIRECT_URI` environment variable to `http://localhost:3000/api/spotify/callback`

Navigate to http://localhost:3000/api/spotify/login and authorize with Spotify.

You should get redirected back to the `/api/spotify/callback` endpoint with a JSON object containing a `refresh_token` value. Copy this value and paste it into the `SPOTIFY_REFRESH_TOKEN` environment variable.

## Last.fm Setup

The music page's dashboard data — top artists and tracks with play counts, recently played history, listening totals, and genre tags — is sourced from Last.fm.

Create a read-only API account at https://www.last.fm/api/account/create and copy the API key into `LASTFM_API_KEY`. Set `LASTFM_USERNAME` to the Last.fm username whose scrobble history should be displayed (defaults to `arazzy` in `.env.example`).

Spotify is still required for the live now-playing bar and to enrich artist images.
