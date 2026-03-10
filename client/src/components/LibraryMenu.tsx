import { Headphones, Library, Plus } from "lucide-react";
import LibraryAlbum from "./LibraryAlbum";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePlaylistStore } from "@/stores/usePlaylistStore";

export default function LibraryMenu() {
  const { collections, fetchCollections } = useMusicStore();
  const { CreatePlaylist } = usePlaylistStore();
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

  const handleCreatePlaylist = async () => {
    CreatePlaylist();
    fetchCollections();
  };

  return (
    <div className="rounded-sm bg-zinc-900 p-4 h-[calc(100vh-240px)] flex flex-col">
      <div className="flex-col items-center justify-between">
        <div className="flex items-center justify-between w-full mb-3 text-white px-1 font-medium">
          <div className="flex">
            <Library className="size-6 mr-2" />
            <h1 className="hidden md:inline">Collection</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" size="icon" variant="ghost">
                <Plus className="size-5 text-zinc-400 hover:text-zinc-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-700 border-none rounded-none">
              <DropdownMenuItem
                onClick={handleCreatePlaylist}
                className="hover:bg-zinc-600 rounded-none text-white"
              >
                <Headphones className="text-white" />
                Create Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      <div className="fkex-1 overflow-y-auto mt-3 no-scrollbar">
        <div className="space-y-2">
          <LibraryAlbum collections={collections} />
        </div>
      </div>
    </div>
  );
}
