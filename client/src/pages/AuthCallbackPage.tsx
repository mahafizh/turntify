
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { isLoaded, user } = useUser();
  const [syncAttempted, setSyncAttempted] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      try {
        if (!isLoaded || !user || syncAttempted) return;
        setSyncAttempted(true);
        await axiosInstance.post("/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          email: user.primaryEmailAddress?.emailAddress
        });
      } catch (error) {
        console.error(error);
      } finally {
        navigate("/");
      }
    };
    syncUser();
  }, [isLoaded, user]);

  return (
    <>
      <div className="flex items-center justify-center h-screen w-full bg-black">
        <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
          <CardContent className="flex flex-col items-center gap-2">
            <Loader className="size-6 animate-spin text-emerald-500" />
            <h1 className="text-zinc-400 text-xl font-bold">Logging You In</h1>
            <p className="text-zinc-400">Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
