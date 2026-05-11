import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import InputForm from "./InputForm";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "sonner";
import { useSocialStore } from "@/stores/useSocialStore";

interface ProfileActionMenuProps {
  isMyOwnProfile: boolean;
  userId?: string;
}

export default function ProfileActionMenu({
  isMyOwnProfile,
  userId,
}: ProfileActionMenuProps) {
  const { user } = useUserStore();
  const { addFriend, removeFriend } = useSocialStore();

  const isFriend = user?.friends?.some((friend: any) => {
    const friendId = typeof friend === "string" ? friend : friend._id;
    return friendId === userId;
  });

  const handleCopyLink = () => {
    const targetUser = userId || user?._id;
    if (!targetUser) return;
    try {
      const url = `${window.location.origin}/profile/${targetUser}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard", {
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("Failed to copy link to clipboard", {
        position: "bottom-center",
      });
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      await addFriend(friendId);
      window.location.reload();
    } catch (error) {
      toast.success("Failed to add friend", { position: "bottom-center" });
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await removeFriend(friendId);
      window.location.reload();
    } catch (error) {
      toast.success("Failed to remove friend", { position: "bottom-center" });
    }
  };

  return (
    <div className="flex items-center gap-6">
      {!isMyOwnProfile && userId && !isFriend && (
        <Button
          onClick={() => handleAddFriend(userId)}
          variant="outline"
          className="text-white rounded-sm bg-transparent border-2 border-zinc-600 hover:bg-transparent hover:border-emerald-600 hover:text-white"
        >
          Add Friend
        </Button>
      )}
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="hover:bg-black/0 group"
              variant="ghost"
              size="icon"
            >
              <Ellipsis className="size-8 text-zinc-400 group-hover:text-zinc-200" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {user && isMyOwnProfile && (
                <InputForm
                  currentUser={user}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Edit details
                    </DropdownMenuItem>
                  }
                />
              )}
              {!isMyOwnProfile && userId && (
                <>
                  {isFriend && (
                    <DropdownMenuItem
                      onClick={() => handleRemoveFriend(userId)}
                    >
                      Remove friend
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>Report</DropdownMenuItem>
                  <DropdownMenuItem>Block</DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={handleCopyLink}>
                Copy link to profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialog>
    </div>
  );
}
