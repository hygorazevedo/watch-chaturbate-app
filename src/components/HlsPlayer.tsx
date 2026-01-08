import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Link, useParams } from "react-router-dom";
import { useRetreaveStream } from "../hooks/useRetreaveStream";

const HlsPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { id } = useParams();
  const { hlsUrl } = useRetreaveStream(id ?? "");
  

  useEffect(() => {
    if (!hlsUrl || !videoRef.current) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ lowLatencyMode: true });
      hls.loadSource(hlsUrl);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = hlsUrl;
    }

    return () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      if (videoRef.current) {
        videoRef.current.src = "";
      }
    };
  }, [hlsUrl]);

  return (
    <>
      <Link to='/'>
        <button>Voltar</button>
      </Link>
      <video ref={videoRef} controls autoPlay style={{ width: "100%" }} />
    </>
  );
}

export default HlsPlayer;