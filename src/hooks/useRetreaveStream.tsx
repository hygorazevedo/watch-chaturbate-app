import { useEffect, useState } from "react";

interface VideoContextResponse {
  hls_source: string;
  [key: string]: any;
}

export function useRetreaveStream(username: string) {
  const [hlsUrl, setHlsUrl] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchVideo = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/cht/api/chatvideocontext/${username}/`,
          {
            headers: {
              "accept": "*/*",
              "x-requested-with": "XMLHttpRequest",
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        const json: VideoContextResponse = await response.json();

        if (!json.hls_source) {
          throw new Error("Nenhuma fonte HLS encontrada");
        }

        setHlsUrl(json.hls_source);

        const hlsResponse = await fetch(json.hls_source);
        if (!hlsResponse.ok) throw new Error(`Erro HLS ${hlsResponse.status}`);

        const hlsText = await hlsResponse.text();
        setPlaylist(hlsText);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [username]);

  return { hlsUrl, playlist, loading, error };
}
