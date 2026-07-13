import type { CurrentCollection } from "@/types";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { CirclePlus, Ellipsis, Heart, Pause, Play } from "lucide-react";
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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAlbumStore } from "@/stores/useAlbumStore";
import { useUserStore } from "@/stores/useUserStore";

interface CollectionActionMenuProps {
  collectionId: string;
  isMyOwnCollection: boolean;
  isCollaborator: boolean;
  currentCollection: CurrentCollection;
}
export default function CollectionActionMenu({
  collectionId,
  currentCollection,
  isMyOwnCollection,
  isCollaborator,
}: CollectionActionMenuProps) {
  const { togglePlay, playCollection, currentSong, isPlaying, addToQueue } =
    usePlayerStore();
  const {
    playlists,
    UpdatePlaylist,
    DeletePlaylist,
    addCollaboratorToPlaylist,
    removeCollaboratorFromPlaylist,
  } = usePlaylistStore();
  const { collections, fetchCollections, fetchCollectionById } =
    useMusicStore();
  const { addAlbumToCollection, removeAlbumFromCollection } = useAlbumStore();
  const navigate = useNavigate();
  const { user } = useUserStore();

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

  const isCollectionLiked = collections.some(
    (c) => c._id === currentCollection?._id,
  );

  const handleAddToCollection = async () => {
    try {
      await addAlbumToCollection(currentCollection._id);
      toast.success("Album added to collection", {
        position: "bottom-center",
      });
      await fetchCollections();
    } catch (error) {
      toast.error("Failed to add album to collection", {
        position: "bottom-center",
      });
    }
  };

  const handleRemoveFromCollection = async () => {
    try {
      await removeAlbumFromCollection(currentCollection._id);
      toast.success("Album removed from collection", {
        position: "bottom-center",
      });
      await fetchCollections();
    } catch (error) {
      toast.error("Failed to remove album from collection", {
        position: "bottom-center",
      });
    }
  };

  const handleCopyLink = () => {
    try {
      const url = `${window.location.origin}/collections/${currentCollection._id}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard", {
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("Failed to copy link to clipboard", {
        position: "bottom-center",
      });
    }
  };

  const handleAddCollaborator = async () => {
    if (currentCollection.collection !== "playlist" || !user?._id) return;
    try {
      await addCollaboratorToPlaylist(currentCollection._id, user._id);
      toast.success("Playlist added to your collection", {
        position: "bottom-center",
      });
      await fetchCollections();
    } catch (error) {
      toast.error("Failed to add playlist to your collection", {
        position: "bottom-center",
      });
    }
  };

  const handleRemoveCollaborator = async () => {
    if (currentCollection.collection !== "playlist" || !user?._id) return;
    try {
      await removeCollaboratorFromPlaylist(currentCollection._id, user._id);
      toast.success("Playlist removed from your collection", {
        position: "bottom-center",
      });
      await fetchCollections();
    } catch (error) {
      toast.error("Failed to remove playlist from your collection", {
        position: "bottom-center",
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
        <Heart
          onClick={() => {
            if (isCollectionLiked) handleRemoveFromCollection();
            else handleAddToCollection();
          }}
          className={`size-8 ${isCollectionLiked ? "text-green-500 fill-green-500 hover:scale-110" : "text-zinc-400 hover:text-zinc-200"}`}
        />
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
            {!isMyOwnCollection && (
              <DropdownMenuGroup>
                {!isCollaborator ? (
                  <DropdownMenuItem onClick={handleAddCollaborator}>
                    Add to collection
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleRemoveCollaborator}>
                    Remove to collection
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            )}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleAddToQueue}>
                Add to queue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            {isMyOwnCollection &&
              currentCollection?.collection === "playlist" && (
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
                  <DropdownMenuItem onClick={handleCopyLink}>
                    Invite collaborators
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuGroup>
              )}
            {currentCollection?.collection === "album" &&
              currentCollection?.visibility === "public" && (
                <DropdownMenuGroup>
                  {isCollectionLiked ? (
                    <DropdownMenuItem onClick={handleRemoveFromCollection}>
                      Remove from Your Collection
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleAddToCollection}>
                      Add to Your Collection
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Add to playlist
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {playlists.map((playlist) => (
                          <DropdownMenuItem key={playlist._id}>
                            {playlist.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                </DropdownMenuGroup>
              )}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleCopyLink}>
                Share
              </DropdownMenuItem>
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
      {!isMyOwnCollection && !isCollaborator && (
        <CirclePlus className="text-zinc-400 size-8 hover:text-zinc-200" />
      )}
    </div>
  );
}
