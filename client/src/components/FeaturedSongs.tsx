import greetings from "@/lib/greetings";
import type { Song } from "@/types";
import PlayButton from "./PlayButton";

export default function FeaturedSong({ featured }: any) {
  return (
    <div>
      <h1 className="mb-6 text-white text-3xl font-bold">{greetings()}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8 ">
        {featured.map((song: Song) => (
          <div
            key={song._id}
            className="group flex items-center h-16 bg-zinc-900/50 hover:bg-zinc-800/70 rounded-sm"
          >
            {song.album?.imageUrl ? (
              <img
                src={song.album?.imageUrl}
                alt={song.title}
                className="h-16 w-16 bg-zinc-700 shrink-0 rounded-sm"
              />
            ) : (
              <img
                src={import.meta.env.VITE_DEFAULT_IMAGE}
                alt={song.title}
                className="h-16 w-16 bg-zinc-700 shrink-0 rounded-sm"
              />
            )}
            <div className="flex flex-col flex-1 min-w-0 p-4">
              <div className="text-white text-sm leading-5 line-clamp-2">
                {song.title}
              </div>
            </div>
            <div className="mr-2 group-hover:block">
              <PlayButton song={song} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
