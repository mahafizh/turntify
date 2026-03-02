import { Library } from "lucide-react";
import LibraryAlbum from "./LibraryAlbum";
import { SquarePlus } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

export default function LibraryMenu() {
  const { collections, fetchCollections } = useMusicStore();
  const [active, setActive] = useState<"album" | "playlist" | null>(null);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleToggle = (type: "album" | "playlist") => {
    if (active === type) {
      setActive(null);
      fetchCollections();
    } else {
      setActive(type);
      fetchCollections(type);
    }
  };

  return (
    <div className="rounded-sm bg-zinc-900 p-4">
      <div className="flex-col items-center justify-between">
        <div className="flex items-center justify-between w-full mb-3 text-white px-1 font-medium">
          <div className="flex">
            <Library className="size-6 mr-2" />
            <h1 className="hidden md:inline">Collection</h1>
          </div>
          <SquarePlus className="size-6 hover:text-gray-400" />
        </div>
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => handleToggle("album")}
            className="bg-gray-700 w-1/2 h-7 rounded-lg"
          >
            Albums
          </Button>
          <Button
            onClick={() => handleToggle("playlist")}
            className="bg-gray-700 w-1/2 h-7 rounded-lg"
          >
            Playlists
          </Button>
        </div>
      </div>
      <div className="rounded-md border h-[calc(100vh-300px)] border-hidden">
        <div className="space-y-2">
          <LibraryAlbum collections={collections} />
        </div>
      </div>
    </div>
  );
}
