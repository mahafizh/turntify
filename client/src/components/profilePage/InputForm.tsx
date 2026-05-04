import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import type { User } from "@/types";
import ImageUpload from "../collectionPage/ImageUpload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUserStore } from "@/stores/useUserStore";

interface currentUserProps {
  currentUser?: User;
  trigger?: React.ReactNode;
}

export default function InputForm({ currentUser, trigger }: currentUserProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isLoading, updateUser, fetchUser } = useUserStore();

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      setFormData({
        name: currentUser?.fullName || "",
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!currentUser?._id) return;
    try {
      await updateUser(currentUser._id, {
        name: formData.name,
        imageFile: selectedFile as File,
      });

      await fetchUser();
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
                initialPreview={currentUser?.imageUrl}
                onFileSelect={(file) => setSelectedFile(file)}
              />
            </div>

            <FieldGroup className="col-span-3 flex flex-col gap-3 w-full">
              <Field>
                <Input
                  className="text-white"
                  id="title"
                  value={formData.name}
                  placeholder="Add a name"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
