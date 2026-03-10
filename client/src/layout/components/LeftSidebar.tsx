import LibraryMenu from "@/components/LibraryMenu";
import NavMenu from "@/components/NavMenu";

export default function LeftSidebar() {
  return (
    <div className="flex flex-col m-1 gap-2.5 h-[calc(100vh-120px)]">
      <NavMenu />
      <LibraryMenu />
    </div>
  );
}
