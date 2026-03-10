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
import convertToPascalCase from "@/lib/convertToPascalCase";
import { useMusicStore } from "@/stores/useMusicStore";
import { Clock3, Dot, Ellipsis, Music, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router";
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

export default function CollectionPage() {
  const { fetchCollectionById, currentCollection, isLoading } = useMusicStore();
  const { collectionId } = useParams();
  const { currentSong, isPlaying, playCollection, togglePlay } =
    usePlayerStore();
  const {
    playlists,
    fetchPlaylist,
    AddSongToPlaylist,
    RemoveSongFromPlaylist,
  } = usePlaylistStore();

  useEffect(() => {
    fetchPlaylist();
    if (collectionId) fetchCollectionById(collectionId);
  }, [fetchCollectionById, collectionId]);

  if (isLoading) return null;

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

  const handleRemoveSongFromPlaylist = (songId: string, playlistId: string) => {
    RemoveSongFromPlaylist(songId, playlistId);
    if (collectionId) fetchCollectionById(collectionId);
  };

  return (
    <div className="rounded-md min-w-0">
      <div className="h-[calc(100vh-130px)]">
        <div
          className="absolute inset-0 bg-linear-to-b -mt-12 from-[#5038a0]/80 top-0 via-zinc-900/80 to-zinc-900 pointer-events-none h-[calc(100vh-125px)]"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="relative z-10 ">
            <div className="flex p-4 gap-4">
              <img
                src={currentCollection?.imageUrl}
                alt={currentCollection?.title}
                className="w-50 h-50 shadow-2xl rounded-sm"
              />
              <div className="flex flex-col justify-end min-w-0">
                <p className="text-sm font-bold">
                  {convertToPascalCase(currentCollection?.collection || "")}
                </p>
                <h1 className="text-4xl h-auto font-medium text-wrap min-w-0">
                  {currentCollection?.title}
                </h1>
                <div className="flex items-center text-lg">
                  <span className="text-lg font-medium">
                    {currentCollection?.createdBy.fullName}
                  </span>
                  <Dot size={30} />
                  <span>
                    {currentCollection?.createdAt &&
                      new Date(currentCollection.createdAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                        },
                      )}
                  </span>
                  <Dot size={30} />
                  <span>
                    {convertToMinute(currentCollection?.duration ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-col p-4 bg-linear-to-b from-black/20 via-black/35 to-black/60 backdrop-blur-sm h-[calc(100vh-362px)] rounded-md">
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

              <div className="p-4">
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
                      <TableHead className="text-white/60 font-light text-md">
                        <Clock3 className="size-3.5" strokeWidth={2} />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCollection?.songs.map((song, index) => {
                      const isCurrentSong = currentSong?._id === song._id;
                      return (
                        <TableRow
                          key={song._id}
                          className="hover:bg-white/30 border-0 group"
                        >
                          <TableCell
                            onClick={() => handlePlaySong(index)}
                            className="text-white/80 font-normal w-10"
                          >
                            {isCurrentSong && isPlaying ? (
                              <Music className="size-4 text-green-500" />
                            ) : (
                              <span className="group-hover:hidden pl-1">
                                {index + 1}
                              </span>
                            )}
                            {!isCurrentSong && (
                              <Play className="fill-white h-4 w-4 hidden group-hover:block " />
                            )}
                          </TableCell>
                          <TableCell className="w-60">
                            <div className="flex gap-2">
                              {song.imageUrl ? (
                                <img
                                  src={song.imageUrl}
                                  className="w-10 h-10"
                                  alt=""
                                />
                              ) : (
                                <img
                                  src="https://res.cloudinary.com/dc4k7fypt/image/upload/v1770652127/image-music_okmrp5.jpg"
                                  className="w-10 h-10"
                                  alt=""
                                />
                              )}
                              <div className="items-center justify-center">
                                <h1 className="text-white text-md">
                                  {song.title}
                                </h1>
                                <p className="text-white/80">
                                  {song.performer}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-white/80 font-normal">
                            {song.played}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-white/80 font-normal">
                            {new Date(song.createdAt).toLocaleString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-white/80 font-normal">
                            {convertToMinute(song.duration)}
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
                                  <DropdownMenuItem>
                                    Save to your liked songs
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
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
