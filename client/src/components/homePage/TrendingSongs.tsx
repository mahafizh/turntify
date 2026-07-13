import type { Song } from "@/types";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TrendingSongs({ trending }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: any) => {
    if (!scrollRef.current) return;

    const { current } = scrollRef;

    const amt = 400;

    current.scrollBy({
      left: direction === "left" ? -amt : amt,
      behavior: "smooth",
    });
  };
  return (
    <div className="w-full min-w-0">
      <h1 className="mt-6 mb-3 text-white text-3xl font-bold flex justify-between items-center">
        <div>Happening Right Now</div>
        <div className="flex gap-4">
          <ChevronLeft
            onClick={() => scroll("left")}
            className="text-white/80 hover:text-white"
          />
          <span>
            <ChevronRight
              onClick={() => scroll("right")}
              className="text-white/80 hover:text-white"
            />
          </span>
        </div>
      </h1>
      <div ref={scrollRef} className="w-full overflow-x-auto no-scrollbar">
        <div className="flex gap-4">
          {trending.map((song: Song) => (
            <div
              key={song._id}
              className="shrink-0 min-w-0 rounded-sm bg-zinc-900/50 hover:bg-zinc-800/70 w-46 p-4"
            >
              <img
                src={import.meta.env.VITE_DEFAULT_IMAGE}
                alt={song.title}
                className="mb-2 rounded-sm"
              />
              <div className="font-medium text-lg">{song.title}</div>
              <div className="font-normal text-zinc-400 text-base wrap-break-word line-clamp-2">
                Artist Aggregate
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
