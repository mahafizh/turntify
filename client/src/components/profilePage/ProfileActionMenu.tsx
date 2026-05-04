import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import InputForm from "./InputForm";
import { useUserStore } from "@/stores/useUserStore";

export default function ProfileActionMenu() {
  const { user } = useUserStore();
  return (
    <div className="flex items-center gap-6">
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
              {user && (
                <InputForm
                  currentUser={user}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Edit details
                    </DropdownMenuItem>
                  }
                />
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem>Copy link to profile</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialog>
    </div>
  );
}
