import type { CurrentCollection } from "@/types";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Ellipsis, Heart, Pause, Play } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import InputForm from "@/components/collectionPage/InputForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface CollectionActionMenuProps {
  collectionId: string;
  currentCollection: CurrentCollection;
}
export default function CollectionActionMenu({
  collectionId,
  currentCollection,
}: CollectionActionMenuProps) {
  const { togglePlay, playCollection, currentSong, isPlaying, addToQueue } =
    usePlayerStore();
  const { UpdatePlaylist, DeletePlaylist } = usePlaylistStore();
  const { fetchCollections, fetchCollectionById } = useMusicStore();
  const navigate = useNavigate();

  const handlePlayCollection = () => {
    if (!currentCollection) return;
    const isCurrentCollectionPlaying = currentCollection.songs.some(
      (song) => song._id === currentSong?._id,
    );
    if (isCurrentCollectionPlaying) {
      togglePlay();
    } else {
      playCollection(currentCollection.songs, 0);
    }
  };
  const handleDeletePlaylist = async (playlistId: string) => {
    await DeletePlaylist(playlistId);
    await fetchCollections();
    navigate({ pathname: "/" });
  };

  const handleUpdateVisibility = async () => {
    if (!collectionId) return;
    const newStatus =
      currentCollection?.visibility === "public" ? "private" : "public";
    try {
      await UpdatePlaylist("visibility", collectionId, {
        visibility: newStatus,
      });
      await fetchCollectionById(collectionId);
      toast.success("Playlist visibility updated", {
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToQueue = () => {
    if (currentCollection?.songs && currentCollection.songs.length > 0) {
      addToQueue(currentCollection.songs);

      toast.success(`Added ${currentCollection.songs.length} songs to queue`, {
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex items-center gap-6">
      {currentCollection?.songs && currentCollection.songs.length > 0 && (
        <Button
          onClick={handlePlayCollection}
          className="rounded-full size-16 bg-green-500 hover:bg-green-400 hover:scale-110 transition-all"
        >
          {isPlaying &&
          currentCollection?.songs.some(
            (song) => song._id === currentSong?._id,
          ) ? (
            <Pause className="size-6 text-black fill-black" />
          ) : (
            <Play className="size-6 text-black fill-black" />
          )}
        </Button>
      )}
      {currentCollection?.collection === "album" && (
        <Button className="hover:bg-black/0 group" variant="ghost" size="icon">
          <Heart className="size-8 text-zinc-400 group-hover:text-zinc-200" />
        </Button>
      )}
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="hover:bg-black/0 group"
              variant="ghost"
              size="icon"
            >
              <Ellipsis className="size-8 text-zinc-400 group-hover:text-zinc-200" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleAddToQueue}>
                Add to queue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            {currentCollection?.collection === "playlist" && (
              <DropdownMenuGroup>
                <InputForm
                  currentCollection={currentCollection}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Edit details
                    </DropdownMenuItem>
                  }
                />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </AlertDialogTrigger>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleUpdateVisibility}>
                  {currentCollection.visibility === "public"
                    ? "Make private"
                    : "Make public"}
                </DropdownMenuItem>
                <DropdownMenuItem>Invite collaborators</DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            )}
            <DropdownMenuGroup>
              <DropdownMenuItem>Share</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete from library?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will delete
              <span className="text-white font-semibold">
                {` ${currentCollection.title} `}
              </span>
              from your library
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeletePlaylist(currentCollection._id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
