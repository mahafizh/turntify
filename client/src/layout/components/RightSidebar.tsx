import LoginPrompt from "@/components/LoginPrompt";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Disc3, DotIcon, Music, Play, Users } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";

export default function RightSidebar() {
  const { friends, fetchFriend } = useChatStore();
  const { isSignedIn } = useUser();
  useEffect(() => {
    fetchFriend();
  }, [friends, fetchFriend]);

  return (
    <div className="h-[calc(100vh-120px)] bg-zinc-900 rounded-md flex flex-col p-4 ">
      {isSignedIn ? (
        <div>
          <div className="flex flex-col justify-between border-zinc-800 border-b">
            <div className="flex flex-row gap-2 items-center mb-2">
              <Users className="size-5 shrink-0" />
              <h2 className="font-medium truncate">
                What they're listening to
              </h2>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="py-4 space-y-4">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex cursor-pointer rounded-lg pt-3 gap-3 "
                >
                  <div className="flex group transition-colors">
                    <Avatar className="size-10 block group-hover:hidden">
                      <AvatarImage
                        src={friend.imageUrl}
                        alt={friend.fullName}
                      />
                    </Avatar>
                    <Play className="items-center mt-2 mx-2 hidden group-hover:block" />
                  </div>
                  <div>
                    <h1 className="text-sm font-medium truncate leading-3">
                      {friend.fullName}
                    </h1>
                    <h2 className="flex font-extralight text-sm  items-center">
                      <Link to={"/"} className="hover:underline">
                        Now Playing{" "}
                      </Link>{" "}
                      <DotIcon />{" "}
                      <Link to={"/"} className="hover:underline">
                        The Artist
                      </Link>
                    </h2>
                    <h2 className="text-sm font-extralight leading-3 flex gap-1.5">
                      <span>
                        <Disc3 className="size-3" />
                      </span>
                      <Link to={"/"} className="hover:underline">
                        The Album
                      </Link>
                    </h2>
                  </div>
                  <div className="flex-col ml-auto items-start">
                    <Music className="size-3.5 text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
}
