import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export function useCurrentlyPlaying() {
  const { data, error, isLoading } = useSWR(
    '/api/spotify/currently-playing',
    fetcher,
    { refreshInterval: 30000 }
  );

  return {
    playing: data,
    isLoading,
    isError: error,
  };
}
