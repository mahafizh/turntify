import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";
import { axiosInstance } from "@/lib/axios";
import { getSocket } from "@/lib/socket";
import { useUserStore } from "@/stores/useUserStore";

export default function AudioPlayer() {
  const { user } = useUserStore();
  const socket = getSocket();
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

  useEffect(() => {
    if (!user || !currentSong || !socket) return;

    socket.emit("update_activity", {
      userId: user._id,
      userName: user.fullName,
      userImageUrl: user.imageUrl,
      isPlaying,
      song: {
        title: currentSong.title,
        performer: currentSong.performer,
        imageUrl: currentSong.album?.imageUrl,
      },
    });

    const updateDbActivity = async () => {
      try {
        await axiosInstance.post("/users/update-activity", {
          songId: currentSong._id,
          isPlaying,
        });
      } catch (error) {
        console.error("Failed to update activity in DB", error);
      }
    };
    const timeoutId = setTimeout(updateDbActivity, 2000);
    return () => clearTimeout(timeoutId);

  }, [currentSong, isPlaying, user, socket]);

  return <audio ref={audioRef} />;
}
