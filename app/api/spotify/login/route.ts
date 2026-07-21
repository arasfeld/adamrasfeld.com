// https://developer.spotify.com/documentation/web-api/tutorials/code-flow#request-user-authorization

import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';

const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-top-read',
];

// Must match the cookie name read in callback/route.ts.
const STATE_COOKIE = 'spotify_auth_state';

export function GET() {
  // One-time local setup route for minting a refresh token — never in prod.
  if (process.env.NODE_ENV === 'production') {
    return new Response(null, { status: 404 });
  }

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

  const response = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 600,
    path: '/api/spotify',
  });
  return response;
}
