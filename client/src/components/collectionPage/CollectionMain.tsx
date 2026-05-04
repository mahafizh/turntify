import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertToMinute } from "@/lib/convertToMinute";
import { useMusicStore } from "@/stores/useMusicStore";
import { Clock3, Ellipsis, Heart, Music, Play } from "lucide-react";
import { useEffect } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import SearchCollection from "@/components/collectionPage/SearchCollection";
import CollectionHeader from "@/components/collectionPage/CollectionHeader";
import CollectionActionMenu from "@/components/collectionPage/CollectionActionMenu";
import type { CurrentCollection } from "@/types";

interface CollectionMainProps {
  currentCollection: CurrentCollection;
  collectionId: string;
}

export default function CollectionMain({
  currentCollection,
  collectionId
}: CollectionMainProps) {
  const {
    fetchCollectionById,
    fetchCheckLikedSong,
    isLikedSong,
    AddLikedSong,
    RemoveLikedSong,
  } = useMusicStore();
  const { currentSong, isPlaying, playCollection } = usePlayerStore();
  const {
    playlists,
    fetchPlaylist,
    AddSongToPlaylist,
    RemoveSongFromPlaylist,
  } = usePlaylistStore();

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  useEffect(() => {
    if (currentCollection?.songs) {
      currentCollection.songs.forEach((song) => {
        fetchCheckLikedSong(song._id);
      });
    }
  }, [currentCollection?.songs, fetchCheckLikedSong]);

  const handlePlaySong = (index: number) => {
    if (!currentCollection) return;
    playCollection(currentCollection?.songs, index);
  };

  const songIncluded = (songId: string) => {
    if (!currentCollection) return;
    if (currentCollection.collection === "playlist") {
      return currentCollection.songs.some((song) => song._id === songId);
    }
  };

  const handleRemoveSongFromPlaylist = async (
    songId: string,
    playlistId: string,
  ) => {
    await RemoveSongFromPlaylist(songId, playlistId);
    if (collectionId) fetchCollectionById(collectionId);
  };

  const handleSongLiked = async (type: "add" | "remove", songId: string) => {
    if (type === "add") {
      await AddLikedSong(songId);
    } else if (type === "remove") {
      await RemoveLikedSong(songId);
    }
    if (collectionId) fetchCollectionById(collectionId);
  };
  return (
    <div className="relative">
      <div className="relative z-10">
        {currentCollection && (
          <CollectionHeader currentCollection={currentCollection} />
        )}
        <div className="flex-col p-4 bg-linear-to-b from-black/20 via-black/35 to-black/60 backdrop-blur-sm h-[calc(100vh-20px)] rounded-md">
          {currentCollection && (
            <CollectionActionMenu
              collectionId={collectionId || ""}
              currentCollection={currentCollection}
            />
          )}
          <div className="mt-6">
            {currentCollection?.songs && currentCollection?.songs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-white/30">
                    <TableHead className="text-white/60 font-light text-md w-10">
                      #
                    </TableHead>
                    <TableHead className="text-white/60 font-light text-md w-60">
                      Title
                    </TableHead>
                    <TableHead className="hidden lg:table-cell text-white/60 font-light text-md w-60 justify-self-end">
                      Plays
                    </TableHead>
                    <TableHead className="hidden lg:table-cell text-white/60 font-light text-md w-60 justify-self-end">
                      Date added
                    </TableHead>
                    <TableHead></TableHead>
                    <TableHead className="text-white/60 font-light text-md">
                      <Clock3 className="size-3.5" strokeWidth={2} />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCollection?.songs &&
                  currentCollection.songs.length > 0
                    ? currentCollection.songs.map((song, index) => {
                        const isCurrentSong = currentSong?._id === song._id;
                        return (
                          <TableRow
                            key={song._id}
                            className="hover:bg-white/30 border-0 group"
                          >
                            <TableCell
                              onClick={() => handlePlaySong(index)}
                              className="text-white/80 font-normal w-10 cursor-pointer"
                            >
                              {isCurrentSong && isPlaying ? (
                                <Music className="size-4 text-green-500" />
                              ) : (
                                <>
                                  <span className="group-hover:hidden pl-1">
                                    {index + 1}
                                  </span>
                                  <Play className="fill-white h-4 w-4 hidden group-hover:block" />
                                </>
                              )}
                            </TableCell>

                            <TableCell className="w-60">
                              <div className="flex gap-2">
                                <img
                                  src={
                                    song.imageUrl ||
                                    "https://res.cloudinary.com/dc4k7fypt/image/upload/v1770652127/image-music_okmrp5.jpg"
                                  }
                                  className="w-10 h-10 object-cover rounded"
                                  alt=""
                                />
                                <div>
                                  <h1
                                    className={`text-md ${isCurrentSong ? "text-green-500" : "text-white"}`}
                                  >
                                    {song.title}
                                  </h1>
                                  <p className="text-white/80 text-sm">
                                    {song.performer}
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="hidden lg:table-cell text-white/80 font-normal">
                              {song.played}
                            </TableCell>

                            <TableCell className="hidden lg:table-cell text-white/80 font-normal">
                              {new Date(song.createdAt).toLocaleString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </TableCell>

                            <TableCell>
                              <Heart
                                onClick={() => {
                                  if (!song) return;
                                  if (isLikedSong[song._id]) {
                                    handleSongLiked("remove", song._id);
                                  } else {
                                    handleSongLiked("add", song._id);
                                  }
                                }}
                                className={`cursor-pointer transition-transform ${
                                  isLikedSong[song._id]
                                    ? "text-green-500 fill-green-500 hover:scale-110"
                                    : "text-zinc-400 hover:text-zinc-200"
                                }`}
                              />
                            </TableCell>

                            <TableCell className="text-white/80 font-normal">
                              {convertToMinute("short", song.duration)}
                            </TableCell>

                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    className="hover:bg-black/0"
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <Ellipsis className="size-5 text-zinc-200 hidden group-hover:block" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        isLikedSong[song._id]
                                          ? handleSongLiked("remove", song._id)
                                          : handleSongLiked("add", song._id)
                                      }
                                    >
                                      {isLikedSong[song._id]
                                        ? "Remove from liked songs"
                                        : "Save to liked songs"}
                                    </DropdownMenuItem>

                                    {!songIncluded(song._id) ? (
                                      <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                          Add to playlist
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                          <DropdownMenuSubContent>
                                            {playlists.map((playlist) => (
                                              <DropdownMenuItem
                                                key={playlist._id}
                                                onClick={() =>
                                                  AddSongToPlaylist(
                                                    song._id,
                                                    playlist._id,
                                                  )
                                                }
                                              >
                                                {playlist.title}
                                              </DropdownMenuItem>
                                            ))}
                                          </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                      </DropdownMenuSub>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleRemoveSongFromPlaylist(
                                            song._id,
                                            currentCollection._id,
                                          )
                                        }
                                      >
                                        Remove from playlist
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                </TableBody>
              </Table>
            ) : (
              <SearchCollection collectionId={collectionId || ""} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
