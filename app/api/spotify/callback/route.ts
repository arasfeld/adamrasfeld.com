// https://developer.spotify.com/documentation/web-api/tutorials/code-flow#request-an-access-token

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Must match the cookie name set in login/route.ts.
const STATE_COOKIE = 'spotify_auth_state';

export async function GET(request: NextRequest) {
  // One-time local setup route for minting a refresh token — never in prod.
  if (process.env.NODE_ENV === 'production') {
    return new Response(null, { status: 404 });
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = request.cookies.get(STATE_COOKIE)?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json({ error: 'state mismatch' }, { status: 400 });
  }

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } =
    process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    throw new Error(
      'Missing one of SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, or SPOTIFY_REDIRECT_URI environment variables'
    );
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }),
  });

  const data = await tokenResponse.json();
  const response = tokenResponse.ok
    ? NextResponse.json(data)
    : NextResponse.json(
        { error: 'token exchange failed', details: data },
        { status: 502 }
      );
  response.cookies.delete(STATE_COOKIE);
  return response;
}
