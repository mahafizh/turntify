import { Link } from "react-router";

interface CollectionCardProps {
  id: string;
  title: string;
  creatorName?: string;
  imageUrl?: string;
  basePath?: string;
}

export default function CollectionCard({
  id,
  title,
  creatorName,
  imageUrl,
  basePath = "collections",
}: CollectionCardProps) {
  const defaultImage = import.meta.env.VITE_DEFAULT_IMAGE;
  return (
    <Link
      to={`/${basePath}/${id}`}
      className="shrink-0 min-w-0 rounded-sm bg-zinc-900/50 hover:bg-zinc-800/70 w-46 p-4 group transition-colors"
    >
      <div className="relative w-full aspect-square mb-3">
        <img
          src={imageUrl || defaultImage}
          alt={title}
          className="rounded-sm w-full h-full object-cover shadow-lg"
        />
      </div>

      <div className="font-medium text-white text-lg truncate">{title}</div>

      <div className="font-normal text-zinc-400 text-sm line-clamp-2 wrap-break-words">
        {creatorName}
      </div>
    </Link>
  );
}
