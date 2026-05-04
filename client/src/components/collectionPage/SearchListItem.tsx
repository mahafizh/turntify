import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface SearchListItemProps {
  title: string;
  subtitle: string;
  image: string;
  type: string;
  icon: any;
  isCircle?: boolean;
  songId?: string;
  collectionId?: string;
}

export default function SearchListItem({
  title,
  subtitle,
  image,
  type,
  icon,
  isCircle = false,
  songId,
  collectionId,
}: SearchListItemProps) {
  const { AddSongToPlaylist } = usePlaylistStore();
  const navigate = useNavigate();
  const handleRefresh = () => navigate(0);

  const handleAddSongToPlaylist = async () => {
    if (!songId) return;
    if (!collectionId) return;
    try {
      await AddSongToPlaylist(songId, collectionId);
      await handleRefresh();
      toast.success("Song added to playlist", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed added song to playlist", {
        position: "top-center",
      });
    }
  };

  return (
    <TableRow className="hover:bg-white/5 border-0 group cursor-pointer transition-colors">
      <TableCell className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={image || import.meta.env.VITE_DEFAULT_IMAGE}
              className={`h-12 w-12 object-cover shadow-lg ${isCircle ? "rounded-full" : "rounded-md"}`}
              alt={title}
            />
            <div>
              <p className="text-white font-medium text-base leading-tight">
                {title}
              </p>
              <div className="flex items-center gap-2 text-zinc-400 mt-1">
                <span className="bg-zinc-800 p-1 rounded-sm">{icon}</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
                  {type}
                </span>
                <span className="text-zinc-600">•</span>
                <p className="text-sm">{subtitle}</p>
              </div>
            </div>
          </div>
          {type === "Song" && (
            <Button
              variant="outline"
              className="bg-transparent hover:bg-transparent rounded-2xl hover:border-2 hover:text-white hover:transition-all hover:scale-100"
              onClick={handleAddSongToPlaylist}
            >
              Add
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
