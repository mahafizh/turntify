import { useMusicStore } from "@/stores/useMusicStore";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, Disc, User } from "lucide-react";
import SearchListItem from "./SearchListItem";

interface SearchProps {
  collectionId: string;
}

export default function SearchCollection({ collectionId }: SearchProps) {
  const { globalSearch, searchResult, isLoading } = useMusicStore();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.trim()) globalSearch(keyword);
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword, globalSearch]);

  const hasResults =
    searchResult?.songs?.length > 0 ||
    searchResult?.albums?.length > 0 ||
    searchResult?.users?.length > 0;

  return (
    <div className="w-full border-t py-6 border-zinc-800 space-y-6">
      <div className="w-full max-w-xl space-y-4">
        <p className="font-medium text-2xl text-white">Search</p>
        <Input
          placeholder="Search for songs, albums, or artists..."
          className="bg-zinc-900 border-zinc-700 h-11 text-md"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="w-full">
        <Table>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-0">
                  <TableCell className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded bg-zinc-800" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40 bg-zinc-800" />
                      <Skeleton className="h-3 w-24 bg-zinc-800" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : hasResults ? (
              <>
                {searchResult.songs.map((song) => (
                  <SearchListItem
                    key={song._id}
                    title={song.title}
                    subtitle={song.performer}
                    image={song.album?.imageUrl || ""}
                    type="Song"
                    icon={<Music className="size-3" />}
                    songId={song._id}
                    collectionId={collectionId}
                  />
                ))}
                {searchResult.albums.map((album) => (
                  <SearchListItem
                    key={album._id}
                    title={album.title}
                    subtitle={`Album • ${album.createdBy?.fullName}`}
                    image={album.imageUrl}
                    type="Album"
                    icon={<Disc className="size-3" />}
                  />
                ))}
                {searchResult.users.map((user) => (
                  <SearchListItem
                    key={user._id}
                    title={user.fullName}
                    subtitle="Artist"
                    image={user.imageUrl}
                    type="Artist"
                    isCircle
                    icon={<User className="size-3" />}
                  />
                ))}
              </>
            ) : (
              keyword &&
              !isLoading && (
                <TableRow>
                  <TableCell className="text-center py-20 text-zinc-500">
                    No results found for "{keyword}"
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
