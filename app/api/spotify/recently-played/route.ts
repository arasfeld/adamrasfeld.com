import { type NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/spotify';
import type { Track } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const { access_token } = await getAccessToken();

    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?' +
        params.toString(),
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return NextResponse.json([], { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(
      data.items?.map((item: { track: Track; played_at: string }) => ({
        ...item.track,
        played_at: item.played_at,
      })) || []
    );
  } catch (error) {
    console.error('Error in recently-played API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recently played tracks' },
      { status: 500 }
    );
  }
}
