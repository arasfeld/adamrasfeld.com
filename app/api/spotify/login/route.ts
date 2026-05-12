// https://developer.spotify.com/documentation/web-api/tutorials/code-flow#request-user-authorization

import { randomBytes } from 'node:crypto';
import { redirect } from 'next/navigation';

const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-top-read',
];

export function GET() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
    throw new Error(
      'Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI environment variable'
    );
  }

  const scope = SCOPES.join(' ');
  const state = randomBytes(8).toString('hex');

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    response_type: 'code',
    scope,
    state,
  });

  redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
