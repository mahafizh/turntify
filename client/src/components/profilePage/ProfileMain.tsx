import ProfileHeader from "@/components/profilePage/ProfileHeader";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useRef, useState } from "react";
import ProfileActionMenu from "./ProfileActionMenu";
import CollectionCard from "../CollectionCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CollectionSkeleton from "../collectionPage/CollectionSkeleton";
import { useParams } from "react-router";
import type { User } from "@/types";

export default function ProfileMain() {
  const { fetchUser, user: currentUser, selectedUser } = useUserStore();
  const { id } = useParams();

  const [profileData, setProfileData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isMyOwnProfile = !id || id === currentUser?._id;

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        if (isMyOwnProfile) {
          await fetchUser();
        } else {
          await fetchUser(id);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [id, isMyOwnProfile]);

  useEffect(() => {
    if (isMyOwnProfile && currentUser) {
      setProfileData(currentUser);
    } else if (!isMyOwnProfile && selectedUser) {
      setProfileData(selectedUser);
    }
  }, [currentUser, selectedUser, isMyOwnProfile]);

  const publicPlaylist = profileData?.playlists.filter(
    (p) => p.visibility === "public",
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: any) => {
    if (!scrollRef.current) return;

    const { current } = scrollRef;

    const amt = 400;

    current.scrollBy({
      left: direction === "left" ? -amt : amt,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {!isLoading && profileData ? (
        <div className="relative z-10 ">
          <ProfileHeader currentUser={profileData} />
          <div className="flex-col p-4 bg-linear-to-b from-black/2 via-black/10 to-black/15 backdrop-blur-sm h-[calc(100vh-20px)] rounded-md">
            <ProfileActionMenu isMyOwnProfile={isMyOwnProfile} userId={id} />
            <div className="p-4 relative">
              <div className="w-full min-w-0">
                <h1 className="mb-3 text-white text-3xl font-bold flex justify-between items-center">
                  <div>Public Playlists</div>
                  <div className="flex gap-4">
                    <ChevronLeft
                      onClick={() => scroll("left")}
                      className="text-white/80 hover:text-white"
                    />
                    <span>
                      <ChevronRight
                        onClick={() => scroll("right")}
                        className="text-white/80 hover:text-white"
                      />
                    </span>
                  </div>
                </h1>
                <div
                  ref={scrollRef}
                  className="w-full overflow-x-auto no-scrollbar"
                >
                  <div className="flex gap-4">
                    {publicPlaylist &&
                      publicPlaylist.length > 0 &&
                      publicPlaylist.map((p) => (
                        <CollectionCard
                          key={p._id}
                          id={p._id}
                          title={p.title}
                          creatorName={profileData?.fullName}
                          imageUrl={p.imageUrl}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CollectionSkeleton />
      )}
    </div>
  );
}
