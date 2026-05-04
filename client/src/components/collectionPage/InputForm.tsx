import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CurrentCollection } from "@/types";
import { useState } from "react";
import { Field, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "./ImageUpload";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useMusicStore } from "@/stores/useMusicStore";

interface currentCollectionProps {
  currentCollection?: CurrentCollection;
  trigger?: React.ReactNode;
}

export default function InputForm({
  currentCollection,
  trigger,
}: currentCollectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isLoading, UpdatePlaylist } = usePlaylistStore();
  const { fetchCollectionById } = useMusicStore(); // Ambil fungsi refetch

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      setFormData({
        title: currentCollection?.title || "",
        description: currentCollection?.description || "",
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (currentCollection?.collection !== "playlist") return;

    try {
      await UpdatePlaylist("update", currentCollection._id, {
        imageFile: selectedFile as File,
        title: formData.title,
        description: formData.description,
      });

      await fetchCollectionById(currentCollection._id);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-zinc-700 border-zinc-400 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Edit details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-2">
              <ImageUpload
                initialPreview={currentCollection?.imageUrl}
                onFileSelect={(file) => setSelectedFile(file)}
              />
            </div>

            <FieldGroup className="col-span-3 flex flex-col gap-3 w-full">
              <Field>
                <Input
                  className="text-white"
                  id="title"
                  value={formData.title}
                  placeholder="Add a name"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </Field>

              <Field className="flex-1">
                <Textarea
                  className="text-white h-full border-none"
                  id="feedback"
                  placeholder="Add an optional description"
                  value={formData?.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <DialogClose asChild></DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-500 text-black hover:bg-emerald-600"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
