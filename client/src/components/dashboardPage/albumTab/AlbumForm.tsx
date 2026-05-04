 import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ALBUM_TYPES } from "@/helper/AlbumTypes";
import FileUpload from "./FileUpload";
import { useAlbumStore } from "@/stores/useAlbumStore";
import { toast } from "sonner";
import type { Album } from "@/types";
import { ALBUM_VISIBILITY } from "@/helper/AlbumVisibility";

interface AlbumFormProps {
  album?: Album;
  trigger?: React.ReactNode;
}

export default function AlbumForm({ album, trigger }: AlbumFormProps) {
  const isEditMode = !!album;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { createAlbum, updateAlbum, isLoading, fetchAlbum } = useAlbumStore();

  const [newAlbum, setNewAlbum] = useState({
    title: album?.title || "",
    type: album?.type || "",
    visibility: album?.visibility || "",
  });

  const handleAddAlbum = async (e: any) => {
    e.preventDefault();
    if (!isEditMode && (!selectedFile || !newAlbum.title || !newAlbum.type)) {
      toast.error("Field can't be empty", { position: "top-center" });
      return;
    }
    try {
      if (isEditMode) {
        await updateAlbum(
          album!._id,
          newAlbum.title,
          newAlbum.type,
          newAlbum.visibility,
          selectedFile as File,
        );
      } else {
        await createAlbum(newAlbum.title, newAlbum.type, selectedFile as File);
      }
      await fetchAlbum();
      toast.success(
        `Album ${isEditMode ? "updated" : "uploaded"} successfully`,
        {
          description: `Album has been ${isEditMode ? "updated" : "uploaded"} to your library.`,
          position: "top-center",
        },
      );
      setNewAlbum({ title: "", type: "", visibility: "" });
      setSelectedFile(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to upload album", {
        description: `${error}. Please try again.`,
        position: "top-center",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className="bg-green-600 hover:bg-green-600/90 w-30 p-2"
            size="icon"
          >
            <Plus />
            Add Album
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-zinc-700 border-zinc-400 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditMode ? "Edit Album" : "Add New Album"}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {isEditMode
              ? "Update your album details"
              : "Add a new album to your library"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleAddAlbum}
          className="max-h-[60vh] overflow-y-auto no-scrollbar space-y-4"
        >
          <div>
            <FieldGroup>
              <div>
                <FileUpload
                  label="Cover Art"
                  initialPreview={album?.imageUrl}
                  onFileSelect={(file) => setSelectedFile(file)}
                />
              </div>

              <Field>
                <FieldLabel htmlFor="title" className="text-white">
                  Title
                </FieldLabel>
                <Input
                  className="text-white"
                  id="title"
                  value={newAlbum.title}
                  placeholder="Album title"
                  onChange={(e) =>
                    setNewAlbum({ ...newAlbum, title: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="type" className="text-white">
                  Type
                </FieldLabel>
                <Select
                  value={newAlbum.type}
                  onValueChange={(value) =>
                    setNewAlbum({ ...newAlbum, type: value })
                  }
                >
                  <SelectTrigger
                    id="type"
                    className="text-white bg-zinc-800 border-0"
                  >
                    <SelectValue placeholder="Select album type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 text-white max-h-[40vh] overflow-y-auto no-scrollbar">
                    <SelectGroup>
                      {ALBUM_TYPES.map((type) => (
                        <SelectItem key={type.name} value={type.name}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              {isEditMode && (
                <Field>
                  <FieldLabel htmlFor="visibility" className="text-white">
                    Visibility
                  </FieldLabel>
                  <Select
                    value={newAlbum.visibility}
                    onValueChange={(value) =>
                      setNewAlbum({ ...newAlbum, visibility: value })
                    }
                  >
                    <SelectTrigger
                      id="visibility"
                      className="text-white bg-zinc-800 border-0"
                    >
                      <SelectValue placeholder="Select album type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 text-white max-h-[40vh] overflow-y-auto no-scrollbar">
                      <SelectGroup>
                        {ALBUM_VISIBILITY.map((visibility) => (
                          <SelectItem
                            key={visibility.name}
                            value={visibility.name}
                          >
                            {visibility.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{isLoading ? "Uploading..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
