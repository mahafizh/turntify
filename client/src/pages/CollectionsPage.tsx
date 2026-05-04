import { useMusicStore } from "@/stores/useMusicStore";
import CollectionSkeleton from "@/components/collectionPage/CollectionSkeleton";
import CollectionMain from "@/components/collectionPage/CollectionMain";
import { useParams } from "react-router";
import { useEffect } from "react";

export default function CollectionPage() {
  const { currentCollection, fetchCollectionById, isLoading } = useMusicStore();
  const { collectionId } = useParams();

  useEffect(() => {
    if (collectionId) fetchCollectionById(collectionId);
  }, [fetchCollectionById, collectionId]);

  return (
    <div className="rounded-md min-w-0">
      <div className="h-[calc(100vh-130px)]">
        <div
          className="absolute inset-0 bg-linear-to-b -mt-12 from-[#5038a0]/80 top-0 via-zinc-900/80 to-zinc-900 pointer-events-none h-[calc(100vh-100px)]"
          aria-hidden="true"
        />
        {isLoading && !currentCollection ? (
          <CollectionSkeleton />
        ) : currentCollection ? (
          <CollectionMain
            currentCollection={currentCollection}
            collectionId={collectionId || ""}
          />
        ) : null}
      </div>
    </div>
  );
}
