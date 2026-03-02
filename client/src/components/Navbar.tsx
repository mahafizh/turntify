import {
  SignedOut,
  SignedIn,
  useUser,
  SignOutButton,
} from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Link } from "react-router";
import SIgnInOauthButton from "./SIgnInOauthButton";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const { isAdmin } = useAuthStore();
  const { user } = useUser();
  return (
    <>
      <div className="flex items-center justify-end p-4 sticky top-0 backdrop-blur-md z-20 rounded-md">
        <div className="flex gap-4 items-center">
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={user?.imageUrl} />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-16 bg-zinc-700 border-0 mr-20 rounded-none">
                <DropdownMenuItem className="hover:bg-zinc-600 rounded-none text-white">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-600 rounded-none text-white">
                  Setting
                </DropdownMenuItem>
                <div className="border-t border-zinc-600 ">
                  {isAdmin && (
                    <DropdownMenuItem className="hover:bg-zinc-600 rounded-none text-white">
                      <Link to={"/dashboard"}>Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="hover:bg-zinc-600 rounded-none text-white">
                    <SignOutButton />
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <SignOutButton /> */}
          </SignedIn>

          <SignedOut>
            <SIgnInOauthButton />
          </SignedOut>
        </div>
      </div>
    </>
  );
}
