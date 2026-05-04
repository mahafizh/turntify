import ProfileHeader from "@/components/profilePage/ProfileHeader";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useRef } from "react";
import ProfileActionMenu from "./ProfileActionMenu";
import CollectionCard from "../CollectionCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CollectionSkeleton from "../collectionPage/CollectionSkeleton";

export default function ProfileMain() {
  const { fetchUser, user, isLoading } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, []);

  const publicPlaylist = user?.playlists.filter(
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
      <div className="relative z-10 ">
        {user && <ProfileHeader currentUser={user} />}

        <div className="flex-col p-4 bg-linear-to-b from-black/2 via-black/10 to-black/15 backdrop-blur-sm h-[calc(100vh-20px)] rounded-md">
          <ProfileActionMenu />
          {!isLoading ? (
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
                          creatorName={user?.fullName}
                          imageUrl={p.imageUrl}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <CollectionSkeleton />
          )}
        </div>
      </div>
    </div>
  );
}
