import { usePlayerStore } from "@/stores/usePlayerStore";
import type { Song } from "@/types";
import { Button } from "./ui/button";
import { Pause, Play } from "lucide-react";

export default function PlayButton({ song }: { song: Song }) {
  const { isPlaying, currentSong, setCurrentSong, togglePlay } =
    usePlayerStore();

  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };
  return (
    <div>
      <Button
        onClick={handlePlay}
        className={`mr-2 rounded-full size-10 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all opacity-0 ${isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        {isCurrentSong && isPlaying ? (
          <Pause className="size-4 text-black fill-black" />
        ) : (
          <Play className="size-4 text-black fill-black" />
        )}
      </Button>
    </div>
  );
}
