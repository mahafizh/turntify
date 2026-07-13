import ProfileMain from "@/components/profilePage/ProfileMain";

export default function ProfilePage() {
  return (
    <div className="rounded-md min-w-0">
      <div className="h-[calc(100vh-130px)]">
        <div
          className="absolute inset-0 bg-linear-to-b -mt-12 from-[#738f52] top-0 via-zinc-900/80 to-zinc-900 pointer-events-none h-[calc(100vh-100px)]"
          aria-hidden="true"
        />
        <ProfileMain />
      </div>
    </div>
  );
}
