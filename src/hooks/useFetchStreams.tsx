import { useCallback, useEffect, useRef, useState } from "react";

interface FetchStreamsRequest {
  url: string;
  options: object;
}

interface Stream {
  name: string;
  image: string;
  users: number;
  display: string;
  hlsUrl?: string;
}

function createRequest(category: string, page: number): FetchStreamsRequest {
  return {
    url: `/cht/api/ts/roomlist/room-list/?${category !== '' ? `genders=${category}&` : '' }limit=90&offset=${page}`,
    options: {
      method: "GET",
      headers: {
        accept: "*/*",
        "x-requested-with": "XMLHttpRequest"
      },
    },
  };
}

interface useFetchStreamsResult {
  streams: Stream[];
  loading: boolean;
  hasMore: boolean;
}

export default function useFetchStreams(category: string): useFetchStreamsResult {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);

  const fetchStreams = useCallback(
    async (cat: string) => {
      if (isFetching.current || loading || !hasMore) return;

      isFetching.current = true;
      setLoading(true);

      try {
        const request: FetchStreamsRequest = createRequest(cat, page);
        const response = await fetch(request.url, request.options);
        const data = await response.json();

        setStreams((prev) => [
          ...prev,
          ...data.rooms.map((room: any) => ({
              name: room.username,
              image: room.img,
              users: room.num_users,
              display: room.username
          })),
        ]);
        setHasMore(page + 90 < data.total_count);
        setPage((prev) => prev + 90);
      } catch (err) {
        console.error("Erro ao obter streams:", err);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    },
    [page, loading, hasMore]
  );

  useEffect(() => {
    setStreams([]);
    setPage(0);
    setHasMore(true);
    fetchStreams(category);
  }, [category]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        fetchStreams(category);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchStreams, category]);

  return { streams, loading, hasMore };
}
