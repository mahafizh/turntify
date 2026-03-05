import convertToPascalCase from "@/lib/convertToPascalCase.js";
import type { Collection } from "@/types";
import { Link } from "react-router";

type CollectionProps = {
  collections: Collection[];
};

export default function LibraryAlbum({ collections }: CollectionProps) {
  return (
    <div>
      {collections.map((collection) => (
        <Link
          to={`/collections/${collection._id}`}
          key={collection._id}
          className="flex my-2 gap-4 hover:bg-zinc-700 p-2 rounded-sm items-center"
        >
          <img
            src={collection.imageUrl}
            alt={collection.title}
            className="size-11 rounded-md shrink-0 object-cover"
          />
          <div className="flex-1 hidden sm:block min-w-0">
            <h1 className="font-medium truncate">{collection.title}</h1>
            <h2 className="text-sm truncate">
              {convertToPascalCase(collection.type)}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
