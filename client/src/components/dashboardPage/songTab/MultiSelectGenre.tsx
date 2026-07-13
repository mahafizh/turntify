import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

export function MultiSelectGenre({
  genres,
  selectedGenres,
  setSelectedGenres,
}: any) {
  const [open, setOpen] = useState(false);

  const handleUnselect = (genreId: string) => {
    setSelectedGenres(selectedGenres.filter((id: any) => id !== genreId));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-zinc-800 border-0 text-white hover:bg-zinc-800 h-auto min-h-10"
        >
          <div className="flex flex-wrap gap-1">
            {selectedGenres.length > 0 ? (
              genres
                .filter((g: any) => selectedGenres.includes(g._id))
                .map((genre: any) => (
                  <Badge
                    key={genre._id}
                    variant="secondary"
                    className="bg-zinc-700 text-white"
                  >
                    {genre.title}
                    <button
                      className="ml-1 outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(genre._id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
            ) : (
              <span className="text-muted-foreground">Select genres</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-zinc-800 text-white">
        <Command className="bg-transparent">
          <CommandList>
            <CommandGroup className="text-white">
              {genres.map((genre: any) => (
                <CommandItem
                  key={genre._id}
                  onSelect={() => {
                    setSelectedGenres(
                      selectedGenres.includes(genre._id)
                        ? selectedGenres.filter((id: any) => id !== genre._id)
                        : [...selectedGenres, genre._id],
                    );
                  }}
                  className="hover:bg-zinc-800 cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedGenres.includes(genre._id)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  {genre.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
