import { convertToMinute } from "@/lib/convertToMinute";
import convertToPascalCase from "@/lib/convertToPascalCase";
import type { CurrentCollection } from "@/types";
import { Dot } from "lucide-react";

interface HeaderProps {
  currentCollection: CurrentCollection;
}

export default function CollectionHeader({ currentCollection }: HeaderProps) {
  return (
    <div className="flex p-4 gap-6">
      <img
        src={currentCollection?.imageUrl}
        alt={currentCollection?.title}
        className="w-50 h-50 shadow-2xl rounded-sm"
      />
      <div className="flex flex-col justify-end min-w-0">
        {currentCollection?.collection === "playlist" ? (
          <div className="flex gap-1">
            <p className="text-md font-bold">
              {convertToPascalCase(currentCollection?.visibility || "")}
            </p>
            <p className="text-md font-bold">
              {convertToPascalCase(currentCollection?.collection || "")}
            </p>
          </div>
        ) : currentCollection?.visibility === "private" ? (
          <div className="flex gap-1">
            <p className="text-md font-bold">
              {convertToPascalCase(currentCollection?.visibility || "")}
            </p>
            <p className="text-md font-bold">
              {convertToPascalCase(currentCollection?.collection || "")}
            </p>
          </div>
        ) : (
          <div className="flex gap-1">
            <p className="text-md font-bold">
              {convertToPascalCase(currentCollection?.collection || "")}
            </p>
          </div>
        )}
        <h1 className="text-5xl h-auto font-medium text-wrap min-w-0 my-2">
          {currentCollection?.title}
        </h1>
        <p className="font-light">{currentCollection?.description}</p>
        <div className="flex items-center text-lg mt-2 -space-x-1">
          <div className="w-7 h-7 mr-2 rounded-full overflow-hidden flex-none">
            <img
              className="w-full h-full object-cover"
              src={currentCollection?.createdBy.imageUrl}
              alt={currentCollection?.createdBy.fullName}
            />
          </div>
          <span className="text-sm font-medium text-white">
            {currentCollection?.createdBy.fullName}
          </span>
          <Dot size={30} />
          <span className="text-sm">
            {currentCollection.collection === "album" && (
              <div className="flex justify-center items-center">
                {currentCollection?.createdAt &&
                  new Date(currentCollection.createdAt).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                    },
                  )}
                  <Dot size={30} />
              </div>
            )}
          </span>
          <div className="text-sm">
            {currentCollection?.songs?.length && (
              <div>
                <span>{currentCollection?.songs?.length || 0} songs</span>,
              </div>
            )}
          </div>
          <span className="text-sm text-gray-300 ml-2">
            {convertToMinute("full", currentCollection?.duration ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
