import type { Album } from "@/types";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CollectionCard from "../CollectionCard";

export default function MadeForYouSongs({ madeForYou }: any) {
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
        <div>Made For You</div>
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
          {madeForYou.map((mfy: Album) => (
            <CollectionCard
              key={mfy._id}
              id={mfy._id}
              title={mfy.title}
              creatorName={mfy.createdBy.fullName}
              imageUrl={mfy.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
