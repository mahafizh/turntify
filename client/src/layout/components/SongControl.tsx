import { Button } from "@/components/ui/button";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  BookAudio,
  Heart,
  ListMusic,
  MonitorSpeaker,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { convertToMinute } from "@/lib/convertToMinute";

export default function SongControl() {
  const { isLikedSong, fetchCheckLikedSong } = useMusicStore();
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } =
    usePlayerStore();
  const [volume, setVolume] = useState(50);
  const [lastVolume, setLastVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSeekSong = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (volume === 0) {
      setVolume(lastVolume);
      audioRef.current.volume = lastVolume / 100;
    } else {
      setLastVolume(volume);
      setVolume(0);
      audioRef.current.volume = 0;
    }
  };

  useEffect(() => {
    if (!currentSong) return;
    fetchCheckLikedSong(currentSong?._id);
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
    };
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong, fetchCheckLikedSong]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center w-70 h-20">
        <div className="flex items-center">
          <div>
            {currentSong?.album?.imageUrl ? (
              <img
                src={currentSong?.album?.imageUrl || ""}
                alt=""
                className="h-20 w-20"
              />
            ) : (
              <img
                src={import.meta.env.VITE_DEFAULT_IMAGE}
                alt=""
                className="h-20 w-20"
              />
            )}
          </div>
          <div className="ml-4 w-30 overflow-hidden">
            <div className="flex flex-col whitespace-nowrap animate-marquee hover:paused">
              <span className="font-medium">{currentSong?.title}</span>
            </div>
            <div className="flex flex-col whitespace-nowrap animate-marquee hover:paused">
              <span className="text-sm text-zinc-500 font-medium">
                {currentSong?.performer}
              </span>
            </div>
          </div>
        </div>
        <div className="ml-4">
          {isLikedSong ? (
            <Heart className="fill-green-600 text-green-600" />
          ) : (
            <Heart className="text-zinc-400 hover:text-zinc-200" />
          )}
        </div>
      </div>
      <div className="h-20 flex-1 max-w-full mx-8">
        <div className="flex items-center justify-center gap-4 my-1">
          <Button
            disabled={!currentSong}
            size="icon"
            variant="ghost"
            className="hover:bg-black bg-black group"
          >
            <Shuffle className="size-5 group-hover:text-zinc-200 text-zinc-400" />
          </Button>
          <Button
            onClick={playPrevious}
            disabled={!currentSong}
            size="icon"
            variant="ghost"
            className="hover:bg-black bg-black group"
          >
            <SkipBack className="size-5 group-hover:text-zinc-200 text-zinc-400 fill-zinc-400 group-hover:fill-zinc-200" />
          </Button>
          <Button
            onClick={togglePlay}
            disabled={!currentSong}
            className="size-9 rounded-full bg-zinc-200 hover:scale-110 transition-all hover:bg-zinc-200"
          >
            {isPlaying ? (
              <Pause className="text-black fill-black size-5" />
            ) : (
              <Play className="text-black fill-black size-5" />
            )}
          </Button>
          <Button
            disabled={!currentSong}
            onClick={playNext}
            size="icon"
            variant="ghost"
            className="hover:bg-black bg-black group"
          >
            <SkipForward className="size-5 group-hover:text-zinc-200 text-zinc-400 fill-zinc-400 group-hover:fill-zinc-200" />
          </Button>
          <Button
            disabled={!currentSong}
            size="icon"
            variant="ghost"
            className="hover:bg-black bg-black group"
          >
            <Repeat className="size-5 group-hover:text-zinc-200 text-zinc-400" />
          </Button>
        </div>
        <div className="flex w-full mt-3 gap-2">
          <div className="text-xs text-zinc-400">
            {convertToMinute(currentTime)}
          </div>
          <Slider
            disabled={!currentSong}
            className="mx-auto w-full hover:cursor-grab active:cursor-grabbing"
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeekSong}
          />
          <div className="text-xs text-zinc-400">
            {convertToMinute(currentSong?.duration || 0)}
          </div>
        </div>
      </div>
      <div className="w-70 h-20 flex justify-center items-center gap-3">
        <BookAudio className="size-5 text-zinc-400 hover:text-zinc-200" />
        <ListMusic className="size-5 text-zinc-400 hover:text-zinc-200" />
        <MonitorSpeaker className="size-5 text-zinc-400 hover:text-zinc-200" />
        <div className="flex w-40 gap-1">
          <div onClick={toggleMute}>
            {volume === 0 ? (
              <VolumeOff className="size-5 text-zinc-400 hover:text-zinc-200" />
            ) : volume <= 50 ? (
              <Volume1 className="size-5 text-zinc-400 hover:text-zinc-200" />
            ) : (
              <Volume2 className="size-5 text-zinc-400 hover:text-zinc-200" />
            )}
          </div>
          <Slider
            className="mx-auto w-full hover:cursor-grab active:cursor-grabbing"
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(value) => {
              const volumeValue = value[0];
              setVolume(volumeValue);
              if (audioRef.current) {
                audioRef.current.volume = volumeValue / 100;
              }
              if (volumeValue > 0) {
                setLastVolume(volumeValue);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
