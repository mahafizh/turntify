import { Outlet } from "react-router";
// import Navbar from "@/components/Navbar";
import LeftSidebar from "@/layout/components/LeftSidebar";
import RightSidebar from "@/layout/components/RightSidebar";
import { Group, Panel, Separator } from "react-resizable-panels";
import Navbar from "@/components/Navbar";
import AudioPlayer from "./components/AudioPlayer";
import SongControl from "./components/SongControl";

export default function MainLayout() {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <Group orientation="horizontal" className="flex-1 flex h-full p-2">
        <AudioPlayer />
        {/* LEFT */}
        <Panel defaultSize="20%" maxSize="40%" minSize="10%">
          <LeftSidebar />
        </Panel>

        <Separator className="w-0.5 bg-black rounded-md transition-colors" />

        {/* MAIN */}
        <Panel defaultSize="60%">
          <div className="m-1 min-w-0 min-h-0 flex flex-col h-full overflow-hidden relative rounded-md">
            <div className="absolute inset-0 bg-linear-to-b from-orange-400 via-orange-600/70 to-black pointer-events-none" />

            <Navbar />

            <div className="flex-1 min-h-0 overflow-y-auto z-10 no-scrollbar">
              <Outlet />
            </div>
          </div>
        </Panel>

        <Separator className="w-1 bg-black rounded-md transition-colors" />

        {/* RIGHT */}
        <Panel defaultSize="15%" minSize="10%" maxSize="40%">
          <div className="m-1">
            <RightSidebar />
          </div>
        </Panel>
      </Group>
      <div className="bg-black mx-3 mt-1.5 h-24">
        <SongControl />
      </div>
    </div>
  );
}
