import { type NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/spotify';
import { TimeRange } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'tracks' or 'artists'

  try {
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const timeRange = searchParams.get('timeRange') || TimeRange.ShortTerm;

    if (!type || !['tracks', 'artists'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type parameter. Must be "tracks" or "artists"' },
        { status: 400 }
      );
    }

    const { access_token } = await getAccessToken();

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      time_range: timeRange,
    });

    const response = await fetch(
      `https://api.spotify.com/v1/me/top/${type}?${params.toString()}`,
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
    return NextResponse.json(data.items || []);
  } catch (error) {
    console.error(`Error in top ${type} API route:`, error);
    return NextResponse.json(
      { error: `Failed to fetch top ${type}` },
      { status: 500 }
    );
  }
}
