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
    url: `/api/ts/roomlist/room-list/?${category !== '' && category !== 'follow' ? `genders=${category}&` :  category === 'follow' ? 'follow=true&' : '' }limit=90&offset=${page}`,
    options: {
      method: "GET",
      headers: {
        accept: "*/*",
        referer: `${category === 'follow' ? 'https://pt.chaturbate.com/followed-cams/': 'https://chaturbate.com/'}`,
        newrelic: "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjE0MTg5OTciLCJhcCI6IjI0NTA2NzUwIiwiaWQiOiI5MTdlNzRjYmIyMDdkYTY2IiwidHIiOiJhMGFjZGVlNjg5ZTY3ZTM5NGQxNzdjMDI5ZjRhMTE5YSIsInRpIjoxNzY3Njk5NTQ3MTQzfX0=",
        "x-newrelic-id": "VQIGWV9aDxACUFNVDgMEUw==",
        "x-requested-with": "XMLHttpRequest",
        cookie: `affkey="eJxtzTEKwCAMQNGrhCxZFKIUB29TFKGUQlE38e4lQtql2yM/IQMrRkA0gFng2QfLznIA5yKHuLG00iUOajVRBCIDdCvSkZV7KcqqaF9O13u0Zj/PpPV66lpfmDgfrN0jrQ=="; sbr=sec:sbr246ae2ec-3db7-48a3-9cc5-8db2b75e6ca3:1vd4tc:AxOJvyse8ipKB9NjDUJdmI4XE4qDF33XlTxv8dcj1xk; _ga=GA1.1.1627498357.1767697600; agreeterms=1; __utfpp=f:trnxb5bbf66c72ca231f02bb321ae2364d5d:1vd4tf:k6yQKnFXCZXOwNl3P6cBjlnktHZTfxOEAnW3ScFHg3g; csrftoken=aU0Yqto4nkHOtPerfOWA25YG4ut58YhB; sessionid=2i9ffhg8rnpe03h794708ayj7xn7m9nk; _iidt=QLFe7yGLC12+Z9KjcreJiwuLFQL+ZPlNXtN6rmJePJWnYEvsp/3UgCEK4Q5VU2whG/cRd9Xp7I8IPQ9z+pPvH30xgWFo6RRJFBgMpldhkAGZgGzyyw==; _vid_t=Q4bX7PFDn2HDkascMmJhY8I9oj132SyWW5a50Ahw1N/Rk+19T/FOAqdPwzrJyI7BkeXJ0lIXBF9gjmhzCzo1E9HpUHh+C2prO0Mhc4OBvxF1iQqA1Q==; cf_clearance=U6IiGnHKoHxCUdGWXkpRhGqLg60EGEmxYbssW92elIk-1767698357-1.2.1.1-xKQpYukgPQQIoer9AevFBBuO_zjmSR_LpIFY5T3.gJMMF9UGblM6y31BmXO8eF_5BatL4thwrbTzocuCX69lMdv4I5aYO8m.MBQmVWuJFXE9YepzfOfxKPke6zXo9w5yzFJbIH4fA9uU893c29EDk7ueHlZuWxlaVJOozZwDi40644pQ6A6NeJmc5QaDe9IUHn9l11GnA.mF2ZvVMFG.xdWGO_NrvhjofkYO3d8Emdg; _ga_GX0FLQH21P=GS2.1.s1767697600$o1$g1$t1767698737$j56$l0$h0; __cf_bm=QuWLPyktMyCf1LIqprB02_7b8GFsH9CR5wKL.TRjMKA-1767699437-1.0.1.1-cJPVH.jrDgtT26KkWTP3nKjUC9o40Ub0SNbaUPvAUnYNCrNWpSeHsbaJC0PYn71nDDGRZYymLEABDxJBiLzLgQ2fU7ngqFyRlvjLS5gCsfM`
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
