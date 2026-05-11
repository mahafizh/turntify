import LoginPrompt from "@/components/LoginPrompt";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocialStore } from "@/stores/useSocialStore";
import { useUser } from "@clerk/clerk-react";
import { Music, Users, Clock } from "lucide-react";
import { useEffect } from "react";
import { getSocket } from "@/lib/socket"; // Import socket helper Anda
import { Link } from "react-router";

export default function RightSidebar() {
  const { friends, fetchFriend, updateFriendActivity } = useSocialStore();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) fetchFriend();
  }, [isSignedIn, fetchFriend]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("friend_activity_update", (data) => {
      updateFriendActivity(data);
    });

    return () => {
      socket.off("friend_activity_update");
    };
  }, [updateFriendActivity]);

  return (
    <div className="h-[calc(100vh-120px)] bg-zinc-900 rounded-md flex flex-col p-4 ">
      {isSignedIn ? (
        <div className="flex flex-col h-full">
          <div className="flex flex-col border-zinc-800 border-b pb-2">
            <div className="flex flex-row gap-2 items-center">
              <Users className="size-5 shrink-0" />
              <h2 className="font-medium truncate">
                What they're listening to
              </h2>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="py-4 space-y-4">
              {friends.map((friend) => {
                const isPlaying = friend.currentPlaying?.isPlaying;
                const currentSong = friend.currentPlaying?.song;
                const lastPlayed = friend.lastPlayed?.[0];

                return (
                  <div
                    key={friend._id}
                    className="flex items-start rounded-lg gap-3 group transition-colors"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="size-10 border border-zinc-800">
                        <AvatarImage
                          src={friend.imageUrl}
                          alt={friend.fullName}
                        />
                      </Avatar>
                      {isPlaying && (
                        <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 rounded-full border-2 border-zinc-900 animate-pulse" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Link to={`${window.location.origin}/profile/${friend._id}`} className="hover:underline text-sm font-medium truncate text-zinc-100">
                          {friend.fullName}
                        </Link>
                        {isPlaying ? (
                          <Music className="size-3 text-emerald-500" />
                        ) : (
                          <Clock className="size-3 text-zinc-500" />
                        )}
                      </div>

                      {isPlaying && currentSong ? (
                        <div className="mt-1">
                          <div className="flex items-center text-xs text-white truncate hover:underline cursor-pointer">
                            {currentSong.title}
                          </div>
                          <div className="flex items-center text-[11px] text-zinc-400 truncate">
                            {currentSong.performer}
                          </div>
                        </div>
                      ) : lastPlayed ? (
                        <div className="mt-1">
                          <p className="text-[11px] text-zinc-500 italic">
                            Last played: {lastPlayed.song?.title}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-1 text-[11px] text-zinc-600">Idle</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
}
