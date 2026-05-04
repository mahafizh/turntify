import type { User } from "@/types";
import { Dot } from "lucide-react";

interface ProfileHeaderProps {
  currentUser: User;
}

export default function ProfileHeader({ currentUser }: ProfileHeaderProps) {

  const lengthPublicPlaylist = currentUser.playlists.filter(
    (p) => p.visibility === "public",
  ).length;

  return (
    <div className="flex p-4 gap-6">
      <img
        src={currentUser?.imageUrl}
        alt={currentUser?.fullName}
        className="w-50 h-50 shadow-2xl rounded-full"
      />
      <div className="flex flex-col justify-end min-w-0">
        <div className="flex gap-1">
          <p className="text-md font-bold">Profile</p>
        </div>
        <h1 className="text-5xl h-auto font-medium text-wrap min-w-0 my-2">
          {currentUser?.fullName}
        </h1>
        <div className="flex items-center text-lg mt-2 -space-x-1">
          <span className="text-sm font-medium text-white">
            {lengthPublicPlaylist} Public Playlist
          </span>
          <Dot size={30} />
          <span className="text-sm font-medium text-white">
            {currentUser.friends.length} Friends
          </span>
        </div>
      </div>
    </div>
  );
}
