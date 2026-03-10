import { cn } from "@/lib/utils";
import { HomeIcon, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router";
import { buttonVariants } from "./ui/button";
import { SignedIn } from "@clerk/clerk-react";

export default function NavMenu() {
  const location = useLocation();
  return (
    <div className="rounded-sm bg-zinc-900 py-4 px-2">
      <div className="flex-col justify-between">
        <Link
          to={"/"}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className:
                "w-full justify-start hover:text-white hover:bg-zinc-800 rounded-sm items-center",
            }),
          )}
        >
          <HomeIcon
            className={
              location.pathname === "/" ? "size-6 fill-white" : "size-6"
            }
          />
          <h1>Home</h1>
        </Link>
        <SignedIn>
          <Link
            to={"/chat"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full justify-start hover:text-white hover:bg-zinc-800 rounded-sm items-center",
              }),
            )}
          >
            <MessageSquare
              className={
                location.pathname === "/chat" ? "size-6 fill-white" : "size-6"
              }
            />
            <h1>Messages</h1>
          </Link>
        </SignedIn>
      </div>
    </div>
  );
}
