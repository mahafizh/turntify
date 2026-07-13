import type { Album, Song } from "@/types";
import { TabsContent } from "@/components/ui/tabs";
import { Ellipsis, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useSongStore } from "@/stores/useSongStore";
import { toast } from "sonner";

import SongForm from "./SongForm";
import { useUserStore } from "@/stores/useUserStore";

type SongTabProps = {
  songs: Song[];
  albums: Album[];
};

export default function SongTabContent({ songs, albums }: SongTabProps) {
  const { fetchSongs, deleteSong, addSongToAlbum, removeSongFromAlbum } =
    useSongStore();
  const { user } = useUserStore();

  const handleDelete = async (songId: string) => {
    if (!songId) return;
    try {
      await deleteSong(songId);
      await fetchSongs(user?._id);
      toast.success("Song deleted successfully", {
        description: "Music has been removed from your library.",
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to delete song", {
        description: `${error}. Please try again.`,
        position: "top-center",
      });
    }
  };

  const handleAddSongToAlbum = async (songId: string, albumId: string) => {
    if (!songId || !albumId) return;
    try {
      await addSongToAlbum(songId, albumId);
      toast.success("Song added to album successfully", {
        description: "Music has been added to your album.",
        position: "top-center",
      });
      await fetchSongs(user?._id);
    } catch (error) {
      toast.error("Failed to add song to album", {
        description: `${error}. Please try again.`,
        position: "top-center",
      });
    }
  };

  const handleRemoveSongFromAlbum = async (songId: string, albumId: string) => {
    if (!songId || !albumId) return;
    try {
      await removeSongFromAlbum(songId, albumId);
      toast.success("Song removed from album successfully", {
        description: "Music has been removed from your album.",
        position: "top-center",
      });
      await fetchSongs(user?._id);
    } catch (error) {
      toast.error("Failed to add remove from album", {
        description: `${error}. Please try again.`,
        position: "top-center",
      });
    }
  };

  return (
    <TabsContent value="songs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 items-center">
          <Music className="text-green-600 size-6" />
          <h1 className="font-medium text-xl">Music Library</h1>
        </div>
        <div>
          <SongForm />
        </div>
      </div>
      {songs && songs?.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-white/30">
              <TableHead className="text-white/60 font-light text-md w-[5%]">
                #
              </TableHead>
              <TableHead className="text-white/60 font-light text-md w-[25%]">
                Title
              </TableHead>
              <TableHead className=" text-white/60 font-light text-md w-[30%] justify-self-end">
                Album
              </TableHead>
              <TableHead className=" text-white/60 font-light text-md w-[20%] justify-self-end">
                Plays
              </TableHead>
              <TableHead className=" text-white/60 font-light text-md w-[20%] justify-self-end">
                Released Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {songs.map((song, index) => (
              <TableRow
                key={song._id}
                className="hover:bg-white/30 border-0 group"
              >
                <TableCell className="text-white/80 font-normal w-10">
                  {index + 1}
                </TableCell>
                <TableCell className="w-60">{song.title}</TableCell>
                <TableCell className=" text-white/80 font-normal">
                  {song.album?.title || "No album added"}
                </TableCell>
                <TableCell className=" text-white/80 font-normal">
                  {song.played}
                </TableCell>
                <TableCell className=" text-white/80 font-normal">
                  {new Date(song.createdAt).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="hover:bg-black/0"
                          variant="ghost"
                          size="icon"
                        >
                          <Ellipsis className="size-5 text-zinc-200 invisible group-hover:visible" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mr-8">
                        <DropdownMenuGroup>
                          <SongForm
                            song={song}
                            trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                Edit
                              </DropdownMenuItem>
                            }
                          />
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </AlertDialogTrigger>
                          {!song.album && (
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                Add song to album
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {albums.map((album) => (
                                  <DropdownMenuItem
                                    key={album._id}
                                    onClick={() =>
                                      handleAddSongToAlbum(song._id, album._id)
                                    }
                                  >
                                    {album.title}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          )}
                          {song.album && (
                            <DropdownMenuItem
                              key={song.album?._id}
                              onClick={() =>
                                handleRemoveSongFromAlbum(
                                  song._id,
                                  song.album!._id,
                                )
                              }
                            >
                              Remove song from album
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                          This action cannot be undone. This will permanently
                          delete
                          <span className="text-white font-semibold">
                            {` ${song.title} `}
                          </span>
                          from the server.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(song._id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete Song
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TabsContent>
  );
}
