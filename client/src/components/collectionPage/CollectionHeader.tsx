import { convertToMinute } from "@/lib/convertToMinute";
import convertToPascalCase from "@/lib/convertToPascalCase";
import type { CurrentCollection } from "@/types";
import { ChevronDown, Dot, Globe, UserMinus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { toast } from "sonner";
import { useMusicStore } from "@/stores/useMusicStore";

interface HeaderProps {
  currentCollection: CurrentCollection;
  isMyOwnCollection: boolean;
}

export default function CollectionHeader({
  currentCollection,
  isMyOwnCollection,
}: HeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { removeCollaboratorFromPlaylist } = usePlaylistStore();
  const { fetchCollectionById } = useMusicStore();

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (currentCollection.collection !== "playlist" || !collaboratorId) return;
    try {
      await removeCollaboratorFromPlaylist(
        currentCollection._id,
        collaboratorId,
      );
      await fetchCollectionById(currentCollection._id);
      toast.success("Collaborator removed from your playlist", {
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("Failed to remove collaborator from your playlist", {
        position: "bottom-center",
      });
    }
  };
  return (
    <div className="flex p-4 gap-6">
      <img
        src={currentCollection?.imageUrl}
        alt={currentCollection?.title}
        className="w-50 h-50 shadow-2xl rounded-sm"
      />
      <div className="flex flex-col justify-end min-w-0">
        {currentCollection?.collection === "playlist" ? (
          <div className="flex gap-1">
            <p className="text-md font-bold">
              {convertToPascalCase(currentCollection?.visibility || "")}
            </p>
            <p className="text-md font-bold">
              {convertToPascalCase(currentCollection?.collection || "")}
            </p>
          </div>
        ) : currentCollection?.visibility === "private" ? (
          <div className="flex gap-1">
            <p className="text-md font-bold">
              {convertToPascalCase(currentCollection?.visibility || "")}
            </p>
            <p className="text-md font-bold">
              {convertToPascalCase(currentCollection?.collection || "")}
            </p>
          </div>
        ) : (
          <div className="flex gap-1">
            <p className="text-md font-bold">
              {convertToPascalCase(currentCollection?.collection || "")}
            </p>
          </div>
        )}
        <h1 className="text-5xl h-auto font-medium text-wrap min-w-0 my-2">
          {currentCollection?.title}
        </h1>
        <p className="font-light">{currentCollection?.description}</p>
        <div className="flex items-center text-lg mt-2">
          <div className="w-7 h-7 mr-2 rounded-full overflow-hidden flex-none">
            <img
              className="w-full h-full object-cover"
              src={currentCollection?.createdBy.imageUrl}
              alt={currentCollection?.createdBy.fullName}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="truncate">
              <span className="text-sm font-medium text-zinc-300 hover:text-white hover:cursor-default">
                {currentCollection?.createdBy.fullName}
                {currentCollection?.collaborators &&
                  currentCollection.collaborators.length > 0 && (
                    <span> and more</span>
                  )}
              </span>
            </DialogTrigger>
            <DialogContent className="bg-zinc-800 border-zinc-800 max-w-xl">
              <DialogHeader className="space-y-2">
                <DialogDescription className="flex text-zinc-200 gap-1 items-center">
                  <Globe className="size-3.5" />
                  <div className="flex gap-1 font-medium text-xs">
                    <p>{convertToPascalCase(currentCollection?.visibility)}</p>
                    <p>{convertToPascalCase(currentCollection?.collection)}</p>
                  </div>
                </DialogDescription>
                <DialogTitle className="text-white font-medium text-3xl">
                  Shared with
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-7 h-7 mr-2 rounded-full overflow-hidden flex-none">
                      <img
                        className="w-full h-full object-cover"
                        src={currentCollection?.createdBy.imageUrl}
                        alt={currentCollection?.createdBy.fullName}
                      />
                    </div>
                    <p className="text-white font-medium">
                      {currentCollection?.createdBy.fullName}
                    </p>
                  </div>
                  <p className="text-white text-sm font-medium">Creator</p>
                </div>
                {currentCollection.collaborators?.map((collaborator) => (
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      <div className="w-7 h-7 mr-2 rounded-full overflow-hidden flex-none">
                        <img
                          className="w-full h-full object-cover"
                          src={collaborator.imageUrl}
                          alt={collaborator.fullName}
                        />
                      </div>
                      <p className="text-white font-medium">
                        {collaborator.fullName}
                      </p>
                    </div>
                    {isMyOwnCollection && collaborator._id ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="group flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer">
                            <Button
                              variant="onlyText"
                              className="-p-2 text-sm font-medium"
                            >
                              Collaborator
                            </Button>
                            <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRemoveCollaborator(collaborator._id)
                            }
                          >
                            <UserMinus className="text-white" />
                            Remove as collaborator
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>
                            <CircleMinus className="text-white" />
                            Remove from playlist
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <p className="text-white text-sm font-medium">
                        Collaborator
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex items-center opacity-0 xl:opacity-100 mt-1">
            <Dot size={30} />
            <span className="text-sm">
              {currentCollection.collection === "album" && (
                <div className="flex justify-center items-center">
                  {currentCollection?.createdAt &&
                    new Date(currentCollection.createdAt).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                      },
                    )}
                  <Dot size={30} />
                </div>
              )}
            </span>
            <div className="text-sm text-white">
              {currentCollection?.songs?.length && (
                <div>
                  <span>{currentCollection?.songs?.length || 0} songs</span>,
                </div>
              )}
            </div>
            <span className="text-sm text-gray-300 ml-2">
              {convertToMinute("full", currentCollection?.duration ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
