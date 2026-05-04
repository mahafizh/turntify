import type { Album } from "@/types";
import { TabsContent } from "@/components/ui/tabs";
import { Ellipsis, Library } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AlbumForm from "./AlbumForm";
import { useAlbumStore } from "@/stores/useAlbumStore";
import { toast } from "sonner";
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
} from "../../ui/alert-dialog";

type AlbumsTabProps = {
  albums: Album[];
};

export default function AlbumTabContent({ albums }: AlbumsTabProps) {
  const { deleteAlbum, fetchAlbum } = useAlbumStore();

  const handleDelete = async (id: string) => {
    try {
      await deleteAlbum(id);
      await fetchAlbum();
      toast.success("Album deleted successfully", {
        description: "Album has been removed from your library.",
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to delete album", {
        description: `${error}. Please try again.`,
        position: "top-center",
      });
    }
  };
  return (
    <TabsContent value="albums">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 items-center">
          <Library className="text-green-600 size-6" />
          <h1 className="font-medium text-xl">Album Library</h1>
        </div>
        <div>
          <AlbumForm />
        </div>
      </div>

      {albums && albums.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-white/10">
              <TableHead className="text-white/60 font-light w-[5%]">
                #
              </TableHead>
              <TableHead className="text-white/60 font-light w-[45%]">
                Title & Songs
              </TableHead>
              <TableHead className="text-white/60 font-light w-[15%]">
                Type
              </TableHead>
              <TableHead className="text-white/60 font-light w-[15%]">
                Visibility
              </TableHead>
              <TableHead className="text-white/60 font-light w-[20%]">
                Created Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {albums.map((album, index) => (
              <TableRow
                key={album._id}
                className="hover:bg-white/5 border-0 group align-top"
              >
                <TableCell className="text-white/60 py-4">
                  {index + 1}
                </TableCell>

                <TableCell className="py-4 flex gap-2 items-start">
                  <img
                    src={album.imageUrl}
                    alt={album.title}
                    className="w-10 h-10"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-medium text-md">
                      {album.title}
                    </span>

                    <div className="gap-x-3 gap-y-1 mt-1">
                      {album.songs && album.songs.length > 0 ? (
                        album.songs.map((song) => (
                          <div
                            key={song._id}
                            className="flex flex-row gap-1.5 text-xs text-zinc-400 px-2"
                          >
                            {song.title}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-500 italic px-2">
                          No songs added
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4 text-zinc-300">
                  {album.type === "ep"
                    ? "EP"
                    : album.type.charAt(0).toUpperCase() + album.type.slice(1)}
                </TableCell>

                <TableCell className="py-4 text-zinc-300">
                  {album.visibility.charAt(0).toUpperCase() +
                    album.visibility.slice(1)}
                </TableCell>

                <TableCell className="py-4 text-zinc-400">
                  {new Date(album.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell className="py-4">
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-white/10"
                        >
                          <Ellipsis className="size-5 text-zinc-400 invisible group-hover:visible" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <AlbumForm
                            album={album}
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
                            {` ${album.title} `}
                          </span>
                          from the server.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(album._id)}
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
