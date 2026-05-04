import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CollectionSkeleton() {
  return (
    <div>
      <div className="flex items-end gap-6 p-4">
        <Skeleton className="size-52 rounded-md bg-white/10" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-20 bg-white/10" />
          <Skeleton className="h-12 w-64 bg-white/10" />
          <Skeleton className="h-4 w-40 bg-white/10" />
        </div>
      </div>
      <div className="bg-black/30 p-4 rounded-md">
        <div className="flex items-center gap-6">
          <Skeleton className="size-16 rounded-full bg-white/10" />
          <Skeleton className="size-8 rounded-full bg-white/10" />
          <Skeleton className="size-8 rounded-full bg-white/10" />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-white/10">
              <TableHead className="w-10">
                <Skeleton className="h-4 w-4 bg-white/10" />
              </TableHead>
              <TableHead className="w-60">
                <Skeleton className="h-4 w-20 bg-white/10" />
              </TableHead>
              <TableHead className="hidden lg:table-cell w-60">
                <Skeleton className="h-4 w-16 bg-white/10" />
              </TableHead>
              <TableHead className="hidden lg:table-cell w-60">
                <Skeleton className="h-4 w-24 bg-white/10" />
              </TableHead>
              <TableHead></TableHead>
              <TableHead>
                <Skeleton className="h-4 w-10 bg-white/10" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent border-0">
                <TableCell>
                  <Skeleton className="h-4 w-4 bg-white/10" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 bg-white/10 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 bg-white/10" />
                      <Skeleton className="h-3 w-24 bg-white/10" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-12 bg-white/10" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-4 bg-white/10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-10 bg-white/10" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
