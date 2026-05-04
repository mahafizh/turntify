import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext, incrementPlayCount, loopMode } =
    usePlayerStore();

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      if (currentSong?._id) incrementPlayCount(currentSong._id);

      if (loopMode === "one") {
        if (audio) {
          audio.currentTime = 0;
          audio.play();
        }
      } else {
        playNext();
      }
    };

    audio?.addEventListener("ended", handleEnded);
    return () => audio?.removeEventListener("ended", handleEnded);
  }, [playNext, currentSong?._id, loopMode]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    const audio = audioRef.current;
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong.audioUrl;
      audio.currentTime = 0;
      prevSongRef.current = currentSong.audioUrl;
      if (isPlaying) {
        audio.oncanplay = () => {
          audio.play().catch(() => {});
        };
      }
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
}
