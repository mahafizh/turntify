import LoginPrompt from "@/components/LoginPrompt";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocialStore } from "@/stores/useSocialStore";
import { useUser } from "@clerk/clerk-react";
import { Music, Users, Clock, DotIcon, Disc } from "lucide-react";
import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { Link } from "react-router";
import { useUserStore } from "@/stores/useUserStore";
import { formatTime } from "@/lib/formatTime";

export default function RightSidebar() {
  const { user } = useUserStore();
  const { friends, fetchFriend, updateFriendActivity } = useSocialStore();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) fetchFriend();
  }, [isSignedIn, fetchFriend]);

  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket(user._id);
    if (!socket) return;

    const handleUpdate = (data: { userId: string; activity: any }) => {
      if (
        data.activity &&
        typeof data.activity === "object" &&
        "song" in data.activity
      ) {
        const formattedData = {
          userId: data.userId,
          isPlaying: data.activity.isPlaying,
          song: data.activity.song,
        };

        updateFriendActivity(formattedData);
      }
    };

    socket.on("activity_update", handleUpdate);

    return () => {
      socket.off("activity_update", handleUpdate);
    };
  }, [user?._id, updateFriendActivity]);

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
                        <Link
                          to={`${window.location.origin}/profile/${friend._id}`}
                          className="hover:underline text-sm font-medium truncate text-zinc-100"
                        >
                          {friend.fullName}
                        </Link>
                        {isPlaying ? (
                          <Music className="size-3 text-emerald-500" />
                        ) : lastPlayed ? (
                          <div className="text-xs text-zinc-400">
                            {formatTime(new Date(lastPlayed?.playedAt || 0))}
                          </div>
                        ) : (
                          <Clock className="size-3 text-zinc-400" />
                        )}
                      </div>

                      {isPlaying && currentSong ? (
                        <>
                          <div className="flex">
                            <div className="flex items-center text-xs text-zinc-400 truncate hover:underline cursor-pointer">
                              {currentSong.title}
                            </div>
                            <DotIcon className="-mx-1 size-5" />
                            <div className="flex items-center text-xs text-zinc-400 truncate">
                              {currentSong.performer}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Disc className="size-3.5 text-zinc-400" />
                            <div className="text-xs text-zinc-400">
                              {currentSong.album?.title || "No Album"}
                            </div>
                          </div>
                        </>
                      ) : lastPlayed ? (
                        <>
                          <div className="flex">
                            <div className="flex items-center text-xs text-zinc-400 truncate hover:underline cursor-pointer">
                              {lastPlayed.song?.title}
                            </div>
                            <DotIcon className="-mx-1 size-5" />
                            <div className="flex items-center text-xs text-zinc-400 truncate">
                              {lastPlayed.song?.performer}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Disc className="size-3.5 text-zinc-400" />
                            <div className="text-xs text-zinc-400">
                              {lastPlayed.song?.album?.title || "No Album"}
                            </div>
                          </div>
                        </>
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
