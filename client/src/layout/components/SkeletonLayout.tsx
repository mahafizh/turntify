export default function SkeletonLayout() {
  return (
    <div className="h-screen w-full bg-black p-4 flex gap-4 overflow-hidden">
      
      <div className="w-98 flex-col gap-2 hidden md:flex">
        <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
          <div className="h-6 w-24 bg-zinc-800 rounded animate-pulse" />
          <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex-1 bg-zinc-900 rounded-lg p-4 space-y-4">
          <div className="h-6 w-20 bg-zinc-800 rounded animate-pulse mb-6" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="size-12 bg-zinc-800 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 rounded-lg overflow-hidden relative">
        <div className="h-64 bg-linear-to-b from-zinc-800 to-zinc-900 p-8">
          <div className="h-10 w-64 bg-zinc-700 rounded animate-pulse mt-12" />
          <div className="flex gap-4 mt-8">
            <div className="h-20 w-64 bg-zinc-700/50 rounded-lg animate-pulse" />
            <div className="h-20 w-64 bg-zinc-700/50 rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-6" />
            <div className="flex gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="size-48 bg-zinc-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-72 bg-zinc-900 rounded-lg p-4 hidden lg:block space-y-6">
        <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className="size-10 bg-zinc-800 rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-full bg-zinc-800 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
