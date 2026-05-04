import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useGenreStore } from "@/stores/useGenreStore";
import { MultiSelectGenre } from "./MultiSelectGenre";
import { useSongStore } from "@/stores/useSongStore";
import { toast } from "sonner";
import type { Song } from "@/types";

interface SongFormProps {
  song?: Song;
  trigger?: React.ReactNode;
}

export default function SongForm({ song, trigger }: SongFormProps) {
  const isEditMode = !!song;
  const { genres, fetchGenres } = useGenreStore();
  const { fetchSongs, createSong, updateSong, isLoading } = useSongStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newSong, setNewSong] = useState({
    title: song?.title || "",
    performer: song?.performer || "",
    writer: song?.writer || "",
    publisher: song?.publisher || "",
    duration: song?.duration || 0,
    releaseYear: song?.releaseYear || 0,
    genres: song?.genre?.map((g: any) => g._id || g) || [],
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const [audioFile, setAudioFile] = useState<File | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleAddSong = async (e: any) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateSong(
          song!._id,
          newSong.title,
          newSong.performer,
          newSong.writer,
          newSong.publisher,
          newSong.duration,
          newSong.releaseYear,
          newSong.genres,
          audioFile as File,
        );
      } else {
        await createSong(
          newSong.title,
          newSong.performer,
          newSong.writer,
          newSong.publisher,
          newSong.duration,
          newSong.releaseYear,
          newSong.genres,
          audioFile as File,
        );
      }
      await fetchSongs();
      toast.success(
        `Song ${isEditMode ? "updated" : "uploaded"} successfully`,
        {
          description: `Song has been ${isEditMode ? "updated" : "uploaded"} to your library.`,
          position: "top-center",
        },
      );
      setNewSong({
        title: "",
        performer: "",
        writer: "",
        publisher: "",
        duration: 0,
        releaseYear: 0,
        genres: [],
      });
      setAudioFile(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to upload song", {
        description: `${error}. Please try again.`,
        position: "top-center",
      });
    }
  };
  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button
              className="bg-green-600 hover:bg-green-600/90 w-30 p-2"
              size="icon"
            >
              <Plus />
              Add Song
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="bg-zinc-700 border-zinc-400 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isEditMode ? "Edit Song" : "Add New Song"}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {isEditMode
                ? "Update your song details"
                : "Add a new song to your library"}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleAddSong}
            className="max-h-[60vh] overflow-y-auto no-scrollbar space-y-4"
          >
            <div>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="audio" className="text-white">
                    Audio File
                  </FieldLabel>
                  <Input
                    id="audio"
                    type="file"
                    accept="audio/*"
                    ref={audioInputRef}
                    onChange={(e) => setAudioFile(e.target.files![0])}
                    className="text-white file:bg-white file:text-black file:font-mediun file:rounded-sm file:mr-4 file:px-2 cursor-pointer"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="title" className="text-white">
                    Title
                  </FieldLabel>
                  <Input
                    placeholder="Song title"
                    className="text-white"
                    id="title"
                    value={newSong.title}
                    onChange={(e) =>
                      setNewSong({ ...newSong, title: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="performer" className="text-white">
                    Performer
                  </FieldLabel>
                  <Input
                    placeholder="Song performer"
                    className="text-white"
                    id="performer"
                    value={newSong.performer}
                    onChange={(e) =>
                      setNewSong({ ...newSong, performer: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="writer" className="text-white">
                    Writer
                  </FieldLabel>
                  <Input
                    placeholder="Song writer"
                    className="text-white"
                    id="writer"
                    value={newSong.writer}
                    onChange={(e) =>
                      setNewSong({ ...newSong, writer: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="publisher" className="text-white">
                    Publisher
                  </FieldLabel>
                  <Input
                    placeholder="Song publisher"
                    className="text-white"
                    id="publisher"
                    value={newSong.publisher}
                    onChange={(e) =>
                      setNewSong({ ...newSong, publisher: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="duration" className="text-white">
                    Duration (in second)
                  </FieldLabel>
                  <Input
                    type="text"
                    className="text-white"
                    id="duration"
                    value={newSong.duration}
                    onChange={(e) =>
                      setNewSong({
                        ...newSong,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="releaseYear" className="text-white">
                    Release year (YYYY)
                  </FieldLabel>
                  <Input
                    placeholder="YYYY"
                    className="text-white"
                    id="releaseYear"
                    value={newSong.releaseYear}
                    onChange={(e) =>
                      setNewSong({
                        ...newSong,
                        releaseYear: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="genre" className="text-white">
                    Genre
                  </FieldLabel>
                  <MultiSelectGenre
                    genres={genres}
                    selectedGenres={newSong.genres}
                    setSelectedGenres={(selected: any) =>
                      setNewSong({ ...newSong, genres: selected })
                    }
                  />
                </Field>
              </FieldGroup>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {isLoading ? "Uploading..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
