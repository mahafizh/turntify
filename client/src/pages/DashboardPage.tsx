import AlbumTabContent from "@/components/dashboardPage/albumTab/AlbumTabContent";
import SongTabContent from "@/components/dashboardPage/songTab/SongTabContent";
import { StatsCard } from "@/components/dashboardPage/StatsCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAlbumStore } from "@/stores/useAlbumStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { useSongStore } from "@/stores/useSongStore";
import { useUserStore } from "@/stores/useUserStore";
import { FileMusic, Headphones, Library, ListMusic } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";

export default function DashboardPage() {
  const { user } = useUserStore();
  const userId = user?._id;
  const { stats, fetchStats } = useMusicStore();
  const { songs, fetchSongs } = useSongStore();
  const { albums, fetchAlbum } = useAlbumStore();

  useEffect(() => {
    if (!stats) fetchStats();
  }, [stats, fetchStats]);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      await fetchAlbum(userId);
      await fetchSongs(userId);
    };
    fetchData();
  }, [userId]);

  const statsData = [
    {
      icon: ListMusic,
      label: "Total Songs",
      value: stats?.totalSongs || 0,
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      icon: Library,
      label: "Total Albums",
      value: stats?.totalAlbums || 0,
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-500",
    },
    {
      icon: Headphones,
      label: "Total Listeners",
      value: stats?.totalListeners || 0,
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-4 min-h-screen bg-linear-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="flex gap-2 items-center">
        <Link to={"/"}>
          <img src="../../../logo.png" alt="logo" className="h-12" />
        </Link>
        <div>
          <p className="font-medium text-xl">Music Manager</p>
          <p className="font-normal text-sm text-zinc-300">
            Manage your music catalog
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statsData.map((stat) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value.toString()}
            bgColor={stat.bgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <Tabs defaultValue="songs" className="bg-zinc-800 rounded-lg p-4">
        <TabsList defaultValue="songs" className="bg-zinc-600">
          <TabsTrigger
            value="songs"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            <FileMusic />
            Songs
          </TabsTrigger>
          <TabsTrigger
            value="albums"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            <Library />
            Albums
          </TabsTrigger>
        </TabsList>

        <SongTabContent songs={songs} albums={albums} />
        <AlbumTabContent albums={albums} />
      </Tabs>
    </div>
  );
}
