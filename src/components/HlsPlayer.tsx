import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Link, useParams } from "react-router-dom";
import { useRetreaveStream } from "../hooks/useRetreaveStream";

const HlsPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { id } = useParams();
  const { hlsUrl } = useRetreaveStream(id ?? "");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

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

  // Função para iniciar gravação
  const startRecording = () => {
    if (videoRef.current) {
      const stream = videoRef.current.captureStream();
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "live-recording.webm";
        a.click();
      };

      recorder.start();
      recorderRef.current = recorder;
      setIsRecording(true);
    }
  };

  // Função para parar gravação
  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
      setIsRecording(false);
    }
  };

  return (
    <>
      <Link to='/'>
        <button>Voltar</button>
      </Link>
      <video ref={videoRef} controls autoPlay style={{ width: "100%" }} />

      <div style={{ marginTop: "10px" }}>
        {!isRecording ? (
          <button onClick={startRecording}>🎥 Iniciar Gravação</button>
        ) : (
          <button onClick={stopRecording}>⏹️ Parar Gravação</button>
        )}
      </div>
    </>
  );
};

export default HlsPlayer;
