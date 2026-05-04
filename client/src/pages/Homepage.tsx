import { useEffect } from "react";
import FeaturedSong from "@/components/homePage/FeaturedSongs";
import MadeForYouSongs from "@/components/homePage/MadeForYouSongs";
import TrendingSongs from "@/components/homePage/TrendingSongs";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useSongStore } from "@/stores/useSongStore";
import { useAlbumStore } from "@/stores/useAlbumStore";

export default function Homepage() {
  const { initQueue } = usePlayerStore();
  const {
    featured,
    // madeForYou,
    trending,
    fetchFeatured,
    // fetchMadeForYou,
    fetchTrending,
  } = useSongStore();

  const { madeForYou, fetchMadeForYou } = useAlbumStore();

  useEffect(() => {
    fetchFeatured();
    fetchMadeForYou();
    fetchTrending();
  }, [fetchFeatured, fetchMadeForYou, fetchTrending]);

  useEffect(() => {
    if (featured.length > 0 && trending.length > 0) {
      const allSongs = [...featured, ...trending];
      console.log(allSongs);
      initQueue(allSongs);
    }
  }, [initQueue, featured, trending]);

  return (
    <div className="min-h-full">
      <div className="relative p-4">
        <FeaturedSong featured={featured} />
        <MadeForYouSongs madeForYou={madeForYou} />
        <TrendingSongs trending={trending} />
      </div>
    </div>
  );
}
